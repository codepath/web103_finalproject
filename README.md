# ArcForge

CodePath WEB103 Final Project

Designed and developed by: Jingyi He, Bingying Li, Adeline Greene, Abdelrahman Mohamed, Allen Ramirez, and Salman Khan

🔗 Link to deployed app:

## About

### Description and Purpose

**ArcForge** is a full-stack story planning web app that helps writers, game designers, and creative teams organize their story ideas in one place. Users can create story projects, add scenes, build character profiles, define locations, and connect characters to specific scenes. Instead of keeping ideas scattered across documents, notes, and spreadsheets, ArcForge gives users a structured workspace for planning story timelines, tracking scene progress, and managing relationships between characters, locations, and story events.

The purpose of ArcForge is to make story development easier and more organized. It helps creators see how each scene fits into the larger story, which characters appear in each scene, where events take place, and what still needs to be completed. This is especially useful for people working on novels, short films, comics, visual novels, or story-driven games.

### Inspiration

ArcForge was inspired by the challenge of planning creative projects with many connected pieces. When building a story, it can be difficult to remember which characters appear in each scene, what role they play, where events happen, and whether each scene is still a draft or finished. Many creators use separate notes, documents, or spreadsheets, but those tools are not always designed for visualizing story structure.

We wanted to build an app that feels both creative and practical: something that gives storytellers a clean way to organize their ideas while also helping them track progress. ArcForge combines the structure of a project management tool with the creativity of a storyboarding workspace, making it useful for writers, student creators, game designers, and small creative teams.

## Tech Stack

Frontend: React, React Router, JavaScript, HTML, CSS

Backend: Node.js, Express.js, PostgreSQL, RESTful API, pg, dotenv

Deployment: Render

Version Control: Git and GitHub

## Features

### Story Project Dashboard

Users can view all story projects from a main dashboard. Each project card shows basic information such as the project title, description, number of scenes, and overall progress.

[gif goes here]

### Create and Edit Story Projects

Users can create a new story project and update project details such as title, description, genre, and project status. This gives creators a starting point for organizing each story separately.

[gif goes here]

### Scene Manager

Users can add, view, edit, and delete scenes within a story project. Each scene can include details such as title, summary, timeline order, mood, status, purpose, and conflict.

[gif goes here]

### Character Profiles

Users can create and manage character profiles with details such as name, role, description, motivation, and notes. This helps creators keep character information organized instead of scattered across separate documents.

[gif goes here]

### Location Library

Users can create reusable story locations and connect scenes to those locations. This helps creators track where events happen and reuse important settings across multiple scenes.

[gif goes here]

### Scene Character Assignments

Users can assign multiple characters to a scene and describe each character's role in that scene. This feature demonstrates a many-to-many relationship between scenes and characters using a join table.

[gif goes here]

### Scene Filtering and Sorting

Users can filter or sort scenes by character, location, mood, status, or timeline order. This makes it easier to find specific story moments and review the structure of a project.

[gif goes here]

### Story Progress Overview

Users can view calculated story progress, such as how many scenes are completed compared to the total number of scenes. This gives creators a quick summary of how much planning work is finished.

[gif goes here]

### Dynamic Detail Pages

Users can navigate to individual story, scene, character, and location pages. These pages use dynamic React Router routes based on the selected item's ID.

Example routes include:

- `/projects/:projectId`

- `/projects/:projectId/scenes/:sceneId`

- `/characters/:characterId`

- `/locations/:locationId`

[gif goes here]

### Form Validation

The app checks required form fields before creating or updating database records. Invalid or incomplete information is not submitted, and the user receives a clear error message.

[gif goes here]

### Confirmation Modal

Before deleting a story project, scene, character, or location, the app displays a confirmation modal to prevent accidental deletion.

[gif goes here]

### Notifications

The app displays temporary success or error messages after important actions, such as creating, updating, or deleting content.

Examples include:

- “Scene created successfully.”

- “Character updated successfully.”

- “Unable to delete location.”

[gif goes here]

### Loading and Submission States

The app displays a loading spinner while retrieving data. Form inputs and submission buttons are temporarily disabled while a request is being processed to prevent duplicate submissions.

For example, a submit button may change from Save Scene to Saving... until the request is completed.

[gif goes here]

### User Authentication and Login

Users must login using an authentication mechanism before saving their projects

[gif goes here]

### Automatically Generated Project Templates

A project template, containing placholder scenes and characters, is automatically generated from on user inputs (eg. the type of project)

[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

### [Name of Feature]

[short description goes here]

[gif goes here]

## Installation Instructions

[instructions go here]
