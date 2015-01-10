#!/usr/bin/env python

import re, requests, os, sys, json
from bs4 import BeautifulSoup as BS
from flask import Flask, render_template, request
#from flask.ext.pymongo import PyMongo

app = Flask(__name__)
#mongo = PyMongo(app)

@app.route('/')
def index():
    print '***** request for /'
    return render_template('index.html')

@app.route('/citysearch')
def citySearch():
    print '***** request for /citysearch'
    baseCity = request.args.get('defaultcity') or 'orangecounty'
    print 'baseCity: %s' % baseCity
    cities = [baseCity] + findNearbyCities(baseCity)
    return render_template('city_search_results.html', cities=cities)

@app.route('/jobsearch')
def jobSearch():
    print '***** request for /jobsearch'
    #cities = json.loads(request.args.get('cities'))
    cities = request.args.getlist('city')
    jobcode = request.args.get('jobcode') or 'sof'
    print 'cities: %s' % cities
    print 'jobcode: %s' % jobcode
    jobsByCity = []
    for city in cities:
        jobs = findGoodJobsByCity(city, jobcode)
        jobsByCity.append({ 'city': city, 'jobs': jobs})
    return render_template('job_search_results.html', jobsByCity=jobsByCity)


@app.route('/search')
def search():
    print '***** request for /search'
    baseCity = request.args.get('defaultcity') or 'orangecounty'
    jobcode = request.args.get('jobcode') or 'sof'
    truncate = request.args.get('truncate') or None

    print 'baseCity: %s' % baseCity
    print 'jobcode:  %s' % jobcode
    print 'truncate: %s' % truncate

    cities = findNearbyCities(baseCity)
    if truncate:
        cities = cities[:3]
    jobsByCity = []
    for city in cities:
        jobs = findGoodJobsByCity(city, jobcode)
        jobsByCity.append({ 'city': city, 'jobs': jobs})
    return render_template('results.html', jobsByCity=jobsByCity)

def findNearbyCities(baseCity):
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

def findGoodJobsByCity(city, jobcode):
    try:
        baseUrl = 'http://%s.craiglist.org' % city
        jobListUrl = '%s/search/%s' % (baseUrl, jobcode)
        soup = BS(requests.get(jobListUrl).text)
        p = re.compile(r'/%s/.*\.html' % jobcode)
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


