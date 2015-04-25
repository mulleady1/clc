#!/usr/bin/env python

import re, requests, os, sys, json
from bs4 import BeautifulSoup as BS
from flask import Flask, render_template, request, jsonify, abort, Response
#from flask.ext.pymongo import PyMongo

app = Flask(__name__)
#mongo = PyMongo(app)

@app.route('/')
def index():
    print '***** request for /'
    return render_template('index.html')

@app.route('/autocomplete')
def autocomplete():
    print '***** request for /autocomplete'
    return Response(open('autocomplete.json').read(), content_type='application/json')

@app.route('/citysearch')
def citySearch():
    print '***** request for /citysearch'
    baseCity = request.args.get('defaultcity') or 'orangecounty'
    print 'baseCity: %s' % baseCity
    cities = [baseCity] + findNearbyCities(baseCity)
    if len(cities) == 1:
        print 'Bad request for baseCity %s' % baseCity
        abort(400)
    return render_template('city_search_results.html', cities=cities)

@app.route('/jobsearch')
def jobSearch():
    print '***** request for /jobsearch'
    #cities = json.loads(request.args.get('cities'))
    city = request.args.get('city')
    jobcode = request.args.get('jobcode') or 'sof'
    keywords = request.args.get('keywords') or ''
    parttime = request.args.get('is_parttime') or 0
    tele = request.args.get('is_telecommuting') or 0
    print 'city: %s' % city
    print 'jobcode: %s' % jobcode
    print 'keywords: %s' % keywords
    print 'parttime: %s' % parttime
    print 'tele: %s' % tele
    jobs = findGoodJobsByCity(city, jobcode, keywords, parttime, tele)
    html = render_template('job_search_results.html', jobs=jobs)
    return jsonify(html=html, city=city)

def findNearbyCities(baseCity):
    try:
        url = 'http://%s.craiglist.org' % baseCity
        print '***** searching for nearby cities at: %s' % url
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
    except:
        return []

def findGoodJobsByCity(city, jobcode, keywords='', parttime='', tele=''):
    try:
        baseUrl = 'http://%s.craiglist.org' % city
        jobListUrl = '%s/search/%s?query=%s&is_parttime=%s&is_telecommuting=%s' % (baseUrl, jobcode, keywords, parttime, tele)
        print '***** searching for jobs at: %s' % jobListUrl
        soup = BS(requests.get(jobListUrl).text)
        p = re.compile(r'/%s/.*\.html' % jobcode)
        allLinks = soup.find_all('a')
        jobDetailLinks = [l for l in allLinks if l.get('href') and p.search(l.get('href')) is not None]
        processedUrls = []
        jobs = []
        for l in jobDetailLinks:
            try:
                jobDetailsUrl = '%s%s' % (baseUrl, l.get('href'))
                if jobDetailsUrl in processedUrls:
                    continue
                processedUrls.append(jobDetailsUrl)
                job = processJobDetails(jobDetailsUrl)
                #print 'job title: %s' % job['title']
                if job:
                    jobs.append(job)
            except Exception:
                pass
        print '***** processed %s urls with %s matching keywords: %s' % (len(processedUrls), len(jobs), keywords)
        return jobs
    except Exception:
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


