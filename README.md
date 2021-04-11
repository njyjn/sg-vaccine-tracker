# SG Vaccine Tracker

![Demo](/client/public/demo.png)

This project consists of two components

- [Web scraper](api/) that gets the latest vaccine count data from MOH, hosted on AWS Lambda and stored in AWS DynamoDB. Presented as a private API for the front end
- React [front end](client/) that presents the latest vaccine data, hosted on Heroku

Do open the respective READMEs for more information

## Calculating the Percentage

The percentage data point presented takes the total number of fully vaccinated persons in the country and divides it against the total number of residents and non residents in Singapore. It is the value as of the date which the authorities last updated their counts.

Currently, data is limited and not updated often; it looks like the updates are only taking place once a week. If and when more data is available to the public, I may consider presenting regional statistics (vaccination per age group, per locale, etc.)

## Disclaimer

Best efforts are made to represent the latest and most accurate data from the following sources  which are publicly available

1. [Ministry of Health (Singapore) COVID-19 Vaccination](https://www.moh.gov.sg/covid-19/vaccination)
2. [Department of Statistics Singapore - Population and Population Structure](https://www.singstat.gov.sg/find-data/search-by-theme/population/population-and-population-structure/latest-data)

To minimize the load on those services without causing disruption, data is scraped only once a day and stored in this project's own backend databases.

Use at your own risk.

## Contributors

- Justin Ng (me)

There are a few bugs that need ironing out. Let me know if you are keen on being a contributor.
