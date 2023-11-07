# Career Portal

CodePath WEB103 Final Project

Designed and developed by: [Chinyere]

🔗 Link to deployed app:

## About
This is a Web application that hopes to help the next generation of college students have a smooth transition into the corporate world

### Description and Purpose
# Description:
Career Connect is a web application for computer science students. Students will have access to quality resources like mentorship, job opportunities, and career tips.
On login, the user is greeted with a home page which includes a brief description of its application and its features. Two main options will be provided on the home page: Create a post, Find opportunity.
If the user creates a post, it would automatically be sent to the admins for approval. The post will only be posted for public consumption upon approval from the admins.
If the user chooses to find an opportunity, they are met with a vast variety of resources like conferences, internship opportunities, interview prep and mentorships. They can filter the opportunities by company, pay, college classification, role and type of opportunity. There would also be anchor links that lead to these opportunities in the real world.
The app will also enable students to bookmark applications and track their application status

# Purpose: 
The purpose of Career Connect is to provide students and professionals with a platform to connect with one another and share resources related to the industry. It consists of a job board that displays a list of opportunities. The users can request to post opportunities and the admins will verify the opportunities before they are displayed to the users. It also allows users to share resources and chat with one another if they’d like to learn more about a specific role or opportunity. 

### Inspiration

As college students, we were interested in exploring how we can bring together career-related information and organize it for users. We wanted to learn how we can create a job board that allows users to save and bookmark opportunities. We also wanted to explore how to create a chat feature and implement it.


## Tech Stack

Frontend: React

Backend: Express.js, SQL, postgreSQL

#### Features
### Baseline features
### [Dynamic routing]
The web app includes dynamic routes for both frontend and backend apps.
[gif goes here]

### [Backend and frontend]
The web app includes an Express backend app and a React frontend app.
[gif goes here]

### [ Railway ]
The web app is deployed on Railway with all pages and features working.
[gif goes here]

### Backend Features
### [Database relationship]
The web app implements a one to many database relationship in Postgres:
[gif goes here]

### [Server routing]
The web app implements a well-designed RESTful API that:
1. Can respond to at least one of each type of request: GET, POST, PATCH, and DELETE.✅
2. Implements proper naming conventions for routes.✅
3. Application will be able to perform basic crud operations through a backend implementation ✅ 

https://www.loom.com/share/3adf23799b404ef0989ea0578c584629?sid=888b39ba-e539-4404-a1ad-a55c70467c04

<div style="position: relative; padding-bottom: 56.25%; height: 0;"><iframe src="https://www.loom.com/embed/3adf23799b404ef0989ea0578c584629?sid=2b38a353-49b8-4d00-9549-1b0cea58fbb6" frameborder="0" webkitallowfullscreen mozallowfullscreen allowfullscreen style="position: absolute; top: 0; left: 0; width: 100%; height: 100%;"></iframe></div>
### [Database reset]
The web app implements the ability to reset the database to its default state.

### Frontend features
### [ Redirection]
The application will contain links to actual internship job postings

[gif goes here]

### [Same page interaction]
The web app implements at least one interaction that the user can initiate and complete on the same page without navigating to a new page.
[gif goes here] 

### [React router implementation]
The web app uses dynamic frontend routes created with React Router.
[gif goes here]

### [React components]
1. The web app uses hierarchically designed React components:
2. Components are broken down into categories, including page and component types.
3. Corresponding container components and presenter components as appropriate.
[gif goes here]

### [Custom features]

### [Error handling]
The web app gracefully handles errors.
[gif goes here]

### [one to one relationship]
The web app includes a one-to-one database relationship.
[gif goes here]

### [Slide out pane]
The web app includes a slide-out pane or modal as appropriate for your use case.
[gif goes here]

### [Interface differences]
There will be a difference in the user and admin interface

[gif goes here]

### [Custom route]
The web app includes a custom non-RESTful route with corresponding controller actions.
[gif goes here]

### [Filtering and sorting]
users will be able to filter opportunities based on a number of predefined categories
[gif goes here]

### [ Create routings]
1. Data is automatically generated in response to a certain event or user action. Examples include generating a default inventory for a new user starting a game or creating a starter set of tasks for a user creating a new task app account.
2. Data submitted via a POST or PATCH request is validated before the database is updated.
[gif goes here]

## Stretch features
1. A subset of pages require the user to log in before accessing the content.
Users can log in and log out via GitHub OAuth with Passport.js.
[gif goes here]

2. There will be a chat feature
[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

## Installation Instructions
in the server directory:
npm install cors morgan
npm install express dotenv
node server.js
