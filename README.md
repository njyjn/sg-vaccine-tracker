# SG Vaccine Tracker

![api unit test status](https://github.com/njyjn/sg-vaccine-tracker/actions/workflows/api.yml/badge.svg)

![Demo](/client/public/demo.png)

This project consists of two components

- [Web scraper](api/) that gets the latest vaccine count data from MOH, hosted on AWS Lambda and stored in AWS DynamoDB. Presented as a private API for the front end. Notifications enabled, sends an update to Slack when new data is available.
- React [front end](client/) that presents the latest vaccine data, hosted on Heroku

Do open the respective READMEs for more information

## Calculating the Data

### Percentage

The percentage data point presented takes the total number of fully vaccinated persons in the country and divides it against the total number of residents and non residents in Singapore. It is the value as-of the date which the authorities last updated their counts.

### Metrics

A number of metrics are now presented alongside the percentage. They are

- **Latest total number of fully vaccinated people**
- **Change in percentage and number of fully vaccinated people since the last update**
- **Average daily change in percentage and number of fully vaccinated people since the last update** -- since updates are sporadic, this metric is a rough approximation
- **Change in average daily change across the current and previous update window**. This metric can be used to gauge whether the pace at which number of people becoming fully vaccinated is quickening or slowing down.

Currently, data is limited and not updated often; it looks like the updates are only taking place once a week. If and when more data is available to the public, I may consider presenting regional/demographical statistics (vaccination per age group, per locale, etc.)

## Disclaimer

Best efforts are made to represent the latest and most accurate data from the following sources which are publicly available

1. [Ministry of Health (Singapore) COVID-19 Vaccination](https://www.moh.gov.sg/covid-19/vaccination)
2. [Department of Statistics Singapore - Population and Population Structure](https://www.singstat.gov.sg/find-data/search-by-theme/population/population-and-population-structure/latest-data)

Historical data for the period preceding 4/3/21 was obtained from [Our World In Data](https://ourworldindata.org/covid-vaccinations)

To minimize the load on those services without causing disruption to said agencies, data is scraped only once a day and stored in this project's own backend databases.

In keeping with the spirit of open and equitable access to data, a limited portion of the API I built to populate the website is publicly available, on purpose. I will leave it to the advanced users to learn of the URL. I do have the option to secure it with a public API key (which lets me impose rate limits and throttles), but I won't even though my infrastructure costs may increase. It is my hope that the community will use it responsibly and fairly towards the betterment of our country and the World.

I am not affiliated to any government entity. Use all information and derived data at your own risk.

## Contributors

- Justin Ng (me)

There are a few bugs that need ironing out. Let me know if you are keen on being a contributor.
