#!/usr/bin/env python

import re, requests, os
from bs4 import BeautifulSoup as BS
from flask import Flask, render_template, request
#from flask.ext.pymongo import PyMongo

app = Flask(__name__)
#mongo = PyMongo(app)

@app.route('/')
def index():
    print '***** request for /'
    return render_template('index.html')

@app.route('/search')
def search():
    print '***** request for /search'
    defaultcity = request.args['defaultcity']
    jobcode = request.args['jobcode']
    cities = findNearbyCities(defaultcity)
    # Debug.
    cities = cities[:1]
    jobsByCity = []
    for city in cities:
        jobs = findGoodJobsByCity(city, jobcode)
        jobsByCity.append({ 'city': city, 'jobs': jobs})
    return render_template('results.html', jobsByCity=jobsByCity)
    #return render_template('index.html', cities=cities)

def findNearbyCities(baseCity='orangecounty'):
	url = 'http://%s.craiglist.org' % baseCity
	soup = BS(requests.get(url).text)
	rightbar = soup.find(id='rightbar')
	citiesContainer = rightbar.find(name='ul', attrs={'class':'acitem'})
	links = citiesContainer.find_all('a')
	p = re.compile(r'(?P<city>\w+).craigslist.org')
	cities = []
	for l in links:
		x = p.search(l.get('href'))
		if x:
			city = x.group('city')
			cities.append(city)
	return cities

def findGoodJobsByCity(city, jobcode='sof'):
    try:
        baseUrl = 'http://%s.craiglist.org' % city
        jobListUrl = '%s/search/%s' % (baseUrl, jobcode)
        soup = BS(requests.get(jobListUrl).text)
        p = re.compile(r'/sof/.*\.html')
        allLinks = soup.find_all('a')
        jobDetailLinks = [l for l in allLinks if p.search(l.get('href')) is not None]
        processedUrls = []
        jobs = []
        for l in jobDetailLinks:
            jobDetailsUrl = '%s%s' % (baseUrl, l.get('href'))
            if jobDetailsUrl in processedUrls:
                continue
            processedUrls.append(jobDetailsUrl)
            job = processJobDetails(jobDetailsUrl)
            if job:
                jobs.append(job)
        return jobs
    except Error:
        return []

def processJobDetails(jobDetailsUrl):
    try:
        soup = BS(requests.get(jobDetailsUrl).text)
        title = soup.find(attrs={'class': 'postingtitle'}).text.strip()
        body = soup.find(id='postingbody')
        return { 'title': title, 'body': body, 'url': jobDetailsUrl }
    except AttributeError:
        return None

if __name__ == '__main__':
    #cities = findNearbyCities()
    #goodJobs = [findGoodJobsByCity(city) for city in cities]
    app.run(debug=True)


