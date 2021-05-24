# Contribution Guide

- [Contribution Guide](#contribution-guide)
  - [Guide for Absolute New Beginners](#guide-for-absolute-new-beginners)
    - [What is a Command Line Interface](#what-is-a-command-line-interface)
    - [Create a GitHub account](#create-a-github-account)
    - [What is Version Control](#what-is-version-control)
    - [Set up SSH access for GitHub](#set-up-ssh-access-for-github)
    - [What are Git commands](#what-are-git-commands)
    - [What are Pull Requests](#what-are-pull-requests)
    - [Setting up for the first time](#setting-up-for-the-first-time)
      - [Fork](#fork)
      - [Clone](#clone)
      - [Checkout](#checkout)
      - [Stage (Add)](#stage-add)
      - [Commit](#commit)
      - [Push](#push)
      - [Congratulations](#congratulations)
  - [Guide for Everyone](#guide-for-everyone)
    - [Components](#components)
    - [Running offline](#running-offline)
      - [API](#api)
        - [Prerequisite: AWS CLI](#prerequisite-aws-cli)
        - [Prerequisite: Docker](#prerequisite-docker)
        - [Run API server offline](#run-api-server-offline)
      - [Client](#client)
    - [Unit Testing](#unit-testing)
    - [Making Pull Requests](#making-pull-requests)

All are welcome to contribute. Please fork the repository and make pull requests against the `main` branch.

I love guiding new developers. For some, this is their first foray into coding. If you are brand new, please read the following section. Otherwise, [skip ahead](#guide-for-everyone).

## Guide for Absolute New Beginners

In order to start contributing, you will need to understand the following

- Understand what a Command Line Interface (CLI) is
- Familiarize yourself with a CLI text editor (Vim, Nano), or use an IDE. I recommend VSCode
- Create a GitHub account
- What is Version Control
- SSH keys to access GitHub from your CLI
- Git Commands

### What is a Command Line Interface

From https://www.hostinger.com/tutorials/what-is-cli

> To put it simply, CLI stands for command line interface. It is a program that allows users to type text commands instructing the computer to do specific tasks.

### Create a GitHub account

GitHub hosts code online and allows developers to collaborate and version control their work. Create an account here https://github.com/join

### What is Version Control

Read about Version Control here https://git-scm.com/book/en/v2/Getting-Started-About-Version-Control

### Set up SSH access for GitHub

See https://docs.github.com/en/github/authenticating-to-github/connecting-to-github-with-ssh

### What are Git commands

See https://www.freecodecamp.org/news/10-important-git-commands-that-every-developer-should-know/

The absolute basic you would need are

- `clone`
- `pull`
- `checkout`
- `status`
- `add`
- `commit`
- `push`

### What are Pull Requests

Read https://docs.github.com/en/github/collaborating-with-issues-and-pull-requests/proposing-changes-to-your-work-with-pull-requests/about-pull-requests

### Setting up for the first time

#### Fork

The first thing you want to do is to **fork** the repository. This copies the entire repository into your account. For this project, the associated license allows anyone to use the code however they like.

#### Clone

You would need to **clone** the repository to download it to your computer. After you have setup SSH keys for your GitHub account, on your Command Line Interface (CLI), enter `git clone git@github.com:njyjn/sg-vaccine-tracker.git` in the directory you would like to save the code.

Then, enter `cd <NAME_OF_REPOSITORY>` and run `git status`

#### Checkout

The recommendation is to develop in the `dev` branch, then merge it into `staging`, then merge it into `main`. In software projects, the code running in production (consumer facing) is typically found in `main` or `master`. For this project, it is `main`. **Checking out** a branch allows you to switch to that branch (or version) and update the code in your local machine accordingly.

Read more about branching strategies here https://nvie.com/posts/a-successful-git-branching-model/

Enter `git checkout dev` to switch into the `dev` branch.

#### Stage (Add)

Once you are done writing code, you have to stage your changes. It helps organize bits of code you want into commits. 

To visualize, think about this Recycling metaphor. You only have one bin at your place. You would place your bottles into "Glass", paper into "Paper" and food into "Compostable"; but since you only have one bin, you can only sort your waste one type at a time. Staging is the same as placing your code into the Recycling Bin based on the 'category', or in development terms, the reason why the code is being added or modified.

To stage, enter `git add -p`. The CLI will then guide you through which changes you want to include and which ones you want to save for later.

#### Commit

Back to the Recycling metaphor. When you are done sorting your code, you want to send it to the Recycling Company. They expect you to tell them what the bin contains. So, you have to leave a message, for example,

`git commit -m "Add glass bottles for recycling"`

Typically, the message you write follows this pattern

`<verb> <noun> <reason>`

In this repo, all you need to pay attention to is the `verb` e.g. `Add, Change, Fix, Allow` and the `reason`.

After you are done committing your changes, go back and stage more code if you have.

#### Push

Think of the **push** as the Recycling Company hauling away all your bins that you have given them.  Similarly, all new commits you have made will go out in the same push and online to GitHub. Once you are ready to upload your changes, enter

`git push`

You may encounter an error in the CLI, especially if its your first time. If so, simply copy the command suggested and hit enter.

#### Congratulations

Congratulations! You have pushed your first commits to the repository. For now, we will stick to the `dev` branch.

Read the next section to find out how to work with code in this repository

## Guide for Everyone

### Components

The repo is split into two directories, `api` and `client`. Information about the two can be found in the respective `README.md`. Code in the `api` takes care of the backend data scraping, storage and API interfacing, while code in the `client` takes care of the frontend visual presentation. They are meant to be completely independent from each other.

The `api` is served by AWS Serverless, while the `client` is a React app running in a dyno in Heroku.

Please leave deployments to the code owner.

### Running offline

This project is able to be run locally. Install the package dependencies in the respective directories `api` and `client` using [npm](https://www.npmjs.com/get-npm) `npm i`.

#### API

##### Prerequisite: AWS CLI

The AWS CLI is needed to sign certain requests, even though no actual connection to AWS is being made. Install AWS CLI [here](https://aws.amazon.com/cli/) and [go through the setup](https://docs.aws.amazon.com/cli/latest/userguide/cli-configure-quickstart.html) to configure with some **dummy credentials**.

##### Prerequisite: Docker

Docker is needed to host a local copy of the Database. Install Docker [here](https://www.docker.com/get-started) 

##### Run API server offline

Within the `api` root directory:

If you haven't done so, clone the `.env.sample` file and rename it to `.env.local`. These variables are needed so that the SSM plugin can mock them for offline use.

Run the following

`./scripts/run_offline.sh`

You are now ready to make requests using the front end

#### Client

The client is easier to set up. Enter `npm run start`

A successful offline run results in a `http://localhost:8001` page getting data from the backend API and displaying the counts. Otherwise, in case of error, an error page is shown.

### Unit Testing

Unit tests are only currently available for the API. Add unit tests to the `__tests__` directory and run using `npm test`.

Place any mock fixtures into `__mock__`.

### Making Pull Requests

Please make all pull requests to `njyjn/sg-vaccine-tracker` against the `staging` branch.

