# Foodwise

CodePath WEB103 Final Project

Designed and developed by: Miho Shimizu, Jiarui Liang

🔗 Link to deployed app:

## About

### Description and Purpose

Foodwise helps people manage and monitor food items they have in thier refrigerator. This app allows users to keep track of what food items they have, their quantities, and expiration dates. Users can share the information among their housemates. This food tracking system facilitates to use their food resources efficiently, reduce food waste, and plan their meals based on the ingredients they have available. It's a handy tool for households, community organizations, and anyone interested in optimizing their food inventory.

### Inspiration

You're all set to cook that favorite recipe, only to find that a crucial ingredient you were sure you had, has magically disappeared - thanks to a helpful housemate! (Sometimes it's your yesterday self.) We've all been there, right? That relatable frustration sparked the idea for our app. We wanted to create a handy solution for managing your pantry and fridge to avoid those letdowns. Whether you're the master chef of the house or just someone tired of unwanted surprises, Foodwise is your answer to lessen "Who used the last egg?" moments and foster a more harmonious kitchen.

## Tech Stack

Frontend: React

Backend: Node.js, Express.js, PostgreSQL (Railway)

## Features

### Fridges

Fridge is the unit of food inventory. Users can create and delete fridges. Within each fridge, users can manage food items by adding, updating, and removing. Additionally, users can manage members to share the info with by adding and removing. 

- Users can create fridges.
- The user who creates the fridge becomes its manager and holds the authority to delete it.
- Fridge should have a name and creator.

[gif goes here]

### Food items

Food items have attributes such as count, expiration date, and category. When the food expires, the item will be highlighted. Users can also mark missing food, so the members know that they need to buy them.

- Food item should have a name, count, expiration date, and category.
- Members can create, update, and delete food items.
- Members can mark missing food items.
- Members can make food items invisible.
- Members can sort food items by expiration date.

[gif goes here]

### Members

Fridge members share the fridge info. Users can be a member of multiple fridges. 

- Managers can invite and remove members.

[gif goes here]

### [ADDITIONAL FEATURES GO HERE - ADD ALL FEATURES HERE IN THE FORMAT ABOVE; you will check these off and add gifs as you complete them]

### Shopping Lists

Users have access to a shopping list that aggregates all missing food items to be bought.

[gif goes here]

### Dash Board

Users can create or access fridges from this page.

[gif goes here]

## Installation Instructions

[instructions go here]
