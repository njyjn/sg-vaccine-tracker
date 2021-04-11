# SG Vaccine Tracker Client

A barebones, single-page client built in React. It has a component that reaches out to the private API to get the latest count data.

## Setup

Assuming Node.js (12.x) and NPM are installed, run `npm install`.

This project is compatible with AWS Elastic Beanstalk and Heroku. 

### Deploying with Elastic Beanstalk

Use `eb init` and `eb create`, then `npm run build`

Finally, `eb deploy --staged`. Don't forget to set your env variables as per the `.env.sample` file. Note the `PORT` should be based on whatever you chose as your proxy server in EB. For nginx, the default is `8081`

### Deploying with Heroku

Heroku offers a much more straightforward way to deploy, but perhaps without that a straightforward way to setup load balancing and whatnot.

The instructions to initialize can be found in every app's deploy tab. Set it up with `heroku git:clone -a <REPO_NAME>`. Since this is a component within a larger git project, you must run the final deployment command in the root of the project. The script `deploy_to_heroku.sh` should help perform that. If not, go to the root manually and run `git subtree push --prefix client heroku main`.