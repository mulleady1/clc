craigslist crawler
=================

It can be frustrating that you can't search for jobs on 
craigslist in a larger scope than your current city,
especially when you live on the border of multiple cities, 
or if you're looking for telecommute work. 

That's the motivation for this tool. It checks a base 
city's craigslist homepage for the nearby cities list. 
From there you select cities and enter the job code to 
search for jobs in your cities of interest.

I'll be adding filters next and a better display of job
search results (tabbed navigation maybe).

features
========
For my own sanity I wrote out the current requirements
of the tool. 

clc web
-------
- Index page with option to enter default city and show
nearby cities (default is 'orangecounty')
- List of nearby cities will have checkboxes to include/exclude
from results (default is exclude)
- Enter 3 letter job code (default is 'sof')
- Search button submits form, executes search for jobs
in checked cities or pulls from cache
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

