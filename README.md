craigslist crawler
=================

From what I understand, you can't search for jobs on 
craigslist in a larger scope than your current city. 
This is frustrating when you live on the border of 
multiple cities, or when you're looking for telecommute
work. 

That's the motivation for this tool. It checks
a default city's craigslist homepage, gets the nearby
cities list, then aggregates all software jobs into
a list. Each item in the list consists of the job posting's
url, title, and body. 

I'll be adding export options and probably a web interface
next, along with filters.

features
========
For my own sanity I wrote out the current requirements
of the tool. 

clc web
-------
- Index page with option to enter default city and show
nearby cities (default is 'orangecounty')
- Enter 3 letter job code (default is 'sof')
- List of nearby cities will have checkboxes to include/exclude
from results (default is include)
- Search button submits form, executes search for jobs
in checked cities
- Client side storage for user preferences/history
(default city, job code, checked cities)

clc daemon
----------
- Daily check for jobs
- Run search based off config file specifying default city,
nearby cities, and job codes
- Filter jobs by metrics specified in config file (salary,
telecommute, keywords)
- Send email to addresses in config file

