# Milestone 3

This document should be completed and submitted during **Unit 7** of this course. You **must** check off all completed tasks in this document in order to receive credit for your work.

## Checklist

This unit, be sure to complete all tasks listed below. To complete a task, place an `x` between the brackets.

You will need to reference the GitHub Project Management guide in the course portal for more information about how to complete each of these steps.

- [✅] In your repo, create a project board.
  - _Please be sure to share your project board with the grading team's GitHub **codepathreview**. This is separate from your repository's sharing settings._
- [✅ ] In your repo, create at least 5 issues from the features on your feature list.
- [✅] In your repo, update the status of issues in your project board.
- [✅] In your repo, create a GitHub Milestone for each final project unit, corresponding to each of the 5 milestones in your `milestones/` directory.
  - [✅] Set the completion percentage of each milestone. The GitHub Milestone for this unit (Milestone 3 - Unit 7) should be 100% completed when you submit for full points.
- [✅] In `readme.md`, check off the features you have completed in this unit by adding a ✅ emoji in front of the feature's name.
  - [✅] Under each feature you have completed, include a GIF showing feature functionality.
- [✅] In this documents, complete all five questions in the **Reflection** section below.

## Reflection

### 1. What went well during this unit?

The frontend development went well this unit. We successfully implemented a beautiful, multi-step signup form with interactive features like Tinder-style swipeable activity cards and an SVG-based interactive NYC borough map. The home page was also redesigned with a stylistic scrolling layout that transitions from a purple "Suggested Groups" section to a dark gray posts feed, creating a polished and engaging user experience.

### 2. What were some challenges your group faced in this unit?

The main challenges involved fine-tuning the user interface elements to ensure they were both functional and visually appealing. Creating the interactive NYC map required careful positioning of SVG paths to prevent borough overlaps and ensure text labels fit properly within each shape. Additionally, implementing smooth animations and transitions while maintaining code cleanliness and performance required multiple iterations and refinements.

### Did you finish all of your tasks in your sprint plan for this week? If you did not finish all of the planned tasks, how would you prioritize the remaining tasks on your list?

We completed all major frontend layout and design tasks for the signup and home pages. Moving forward, the priority will be connecting the frontend to the backend API endpoints we created earlier, implementing actual authentication logic, and ensuring data flows correctly between the client and server. We'll also need to add form validation and error handling to make the user experience more robust.

### Which features and user stories would you consider "at risk"? How will you change your plan if those items remain "at risk"?

The "Brew Random Group" matching algorithm and real-time messaging features are currently at risk due to their complexity. If these remain at risk, we'll focus first on core CRUD operations for users, groups, and posts to ensure a functional MVP. We can implement a simplified group suggestion algorithm initially and add the more sophisticated matching logic in a later iteration. Real-time messaging could also be simplified to basic HTTP polling before implementing WebSockets if time becomes tight.

### 5. What additional support will you need in upcoming units as you continue to work on your final project?

We'll need guidance on best practices for integrating React with Supabase, particularly around authentication flows and real-time subscriptions. Support with deployment strategies would also be helpful as we'll need to deploy both the frontend and backend to production environments. Additionally, guidance on implementing secure API practices and handling edge cases in the matching algorithm would be valuable as we move into the backend integration phase.
