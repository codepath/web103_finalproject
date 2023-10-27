# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

**ER Diagram Tables & Relations**

**Table 1: Users**
- 1 user could be an owner of 0 or more boards
- 1 user can be a member of 0 or more boards
- 1 user can create 0 or more tasks
- 1 user can accept 0 or more tasks

**Table 2: Boards**
- 1 board can have only 1 owner
- 1 board can have 1 or more members
- 1 board can have 0 or more tasks

**Table 3: Board Members**
- 1 board member could be only 1 user
- 1 unique board member could be a member of 1 board

**Table 4: Tasks**
- 1 unique task could belong to only 1 board
- 1 task can have only 1 creator
- 1 task can have 0 or more acceptor


## Add the Entity Relationship Diagram

<img src="https://github.com/ManyaBondada/web103_finalproject/blob/main/planning/capstone_erd.png" alt="er-diagram">
