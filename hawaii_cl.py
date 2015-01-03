#!/usr/bin/env python

import re, requests, os
from bs4 import BeautifulSoup

BASE_URL = 'http://honolulu.craigslist.org'
p = re.compile('/sof/.*\.html')
response = requests.get(BASE_URL + '/search/sof')
soup = BeautifulSoup(response.text)
allLinks = soup.find_all('a')
jobDetailLinks = [l for l in allLinks if p.search(l.get('href')) is not None]
os.chdir('jobs')
processedUrls = []
for l in jobDetailLinks:
    url = BASE_URL + l.get('href')
    if url in processedUrls:
        continue
    processedUrls.append(url)
    res = requests.get(url)
    if '$' in res.text:
        s = BeautifulSoup(res.text)
        title = s.h2.text.strip()
        body = [x for x in s.find_all('section') if 'id' in x.attrs and x['id'] == 'postingbody'][0]
        f = open(title + '.html', 'w')
        #encodedText = body.encode('ascii', 'ignore')
        #encodedText = res.text.encode('ascii', 'ignore')
        #f.write(encodedText)
        #f.write(str(body))
        f.write(str(s).encode('UTF-8'))
        f.close()

print '%s jobs with salary specified.' % len(processedUrls)
