# CodeFM

Designed and developed by: Myesha Mahazabeen & Farnaz Zinnah

🔗 Link to deployed app:

## About

CodeFM is a React based web app that provides vibrant online community for budding coders and tech enthusiasts. Our platform offers a supportive environment where users can access resources, connect with peers, and embark on their coding journey with confidence

### Description and Purpose

- Users can sign up/ log in
- Users can create, read, update and delete posts, comment and react on others post (CRUD operations, One to Many)
- Users can access learning resorces posted by others and can add his/her findings as well
- Users can develop coding or other CS related skills based on preferences (beginner friendly)
- Can build strong network with like minded peers
- Newbeies can get guidance from experts and can learn coding from existing resources
- Users can get insightful information about upcoming events/career fair across the country
- Personalized learning environment
  

### Inspiration

- Codecademy
- GitHub
- CodePath

## Tech Stack

Frontend: React JavaScript

Backend: Node.js, Express.js, PostgreSQL


## Features

1. **Target Audience**: Focus on college computer science freshmen and sophomores.
2. **Personalized Learning**: Users can access resources from platforms like YouTube, Leetcode, and FreeCodeCamp.
3. **Connect with Peers**: Users can engage on discussion boards with CRUD operations.

### Baseline Features:

1. **Express backend and React frontend**: Express for the CRUD operations on the discussion boards and React to display content and allow user interactions. 

2. **Dynamic Routes**: The discussion board would have dynamic routes for individual posts or discussions. For example, `/posts/:postId`.

3. **Deployment on Railway**: Railway for deployment.

4. **One-to-many database relationship**: Connection between users and their posts on the discussion board. One user can have multiple posts.

5. **Many-to-many with a join table**: Users can share multiple resources, and a single resource (like a YouTube tutorial) can be saved by multiple users. This requires a join table.

6. **RESTful API**:
   - **GET**: Fetch a list of posts or resources.
   - **POST**: Create a new post on the discussion board.
   - **PATCH**: Edit an existing post.
   - **DELETE**: Remove a post.

7. **Proper naming conventions for routes**: For instance:
   - GET: `/api/posts/` to get all posts.
   - POST: `/api/posts/` to create a new post.
   - PATCH: `/api/posts/:postId` to edit a specific post.
   - DELETE: `/api/posts/:postId` to delete a specific post.

8. **Reset database**: A simple endpoint or script to reset the database to its default state, especially useful during testing.

9. **Frontend Redirection**: After submitting a new post, redirect the user back to the list of posts or to their newly created post.

10. **On-page interactions**: Users can create or edit a post on the same page without navigating to a new page.

11. **Dynamic frontend routes with React Router**: Using React Router, you can create dynamic routes like `/posts/:postId` to view a specific post's details.

12. **Hierarchical React components**: Break down frontend components methodically:
   - **Page components**: `Home`, `DiscussionBoard`, `ResourceList`.
   - **Presenter components**: `Post`, `Comment`, `ResourceItem`.
   - **Container components**: `PostContainer`, `ResourceContainer` (handles logic).


### Custom Features:

1. **Data Validation**: Validate any POST or PATCH requests to ensure that users aren't submitting empty or inappropriate content.
  
2. **Filtering**: Users could have the option to filter resources based on platforms or categories like "YouTube", "Leetcode", or "Articles".








## Features to be implemented in the future

### Target Audience
- **Focused Learning**: The app is specifically designed for college computer science freshman and sophomore students, ensuring content and resources are tailored to their needs.

### Personalized Learning
- **Skill Development**: Users can practice/learn coding with various resources from platforms like YouTube, Leetcode, FreeCodeCamp, etc., in different programming languages to improve technical skills and understanding.
  
### Connect with Peers
- **Engagement**: Users can join discussions and ask questions in a welcoming community of fellow learners and mentors.
- **Discussion Boards**: Full CRUD operations where users can create, read, update, and delete their posts. They can also comment and react to posts made by others, fostering a community-driven learning environment.

### Progress Tracking
- **Journey Monitoring**: Users can easily monitor their learning journey and see how their learning/engaging skills grow over time.
- **Achievements**: Users earn badges as they progress, providing visual feedback and motivation.

### Network Building
- **Networking**: Users can connect with like-minded peers, laying the foundation for future collaborations or study groups.
- **Guidance**: Newbies have the opportunity to seek guidance from senior students and alumni, bridging the knowledge gap.

### Resource Sharing
- **Resource Hub**: A dedicated section where users can access resources shared by the community. Users can both consume and add resources, establishing a many-to-many relationship in the database for shared resources.

### Career Insights
- **Events & Opportunities**: Users can get information about upcoming events, career fairs, free courses like CodePath, and internships such as Break Through Tech, ensuring they don't miss out on valuable opportunities.

  
### Technical Features (Baseline Features)

- **Integration**:
  - **Express Backend**: The app uses an Express backend to handle server-side operations.
  - **React Frontend**: A responsive frontend built with React for an interactive user experience.

- **Dynamic Routes**: The application includes dynamic routing capabilities for both the frontend and backend, ensuring a seamless user journey.

- **Deployment**: The web application is deployed on Railway with all pages and features fully operational.

- **Database Relationships**: 
  - **One-to-Many**: The app showcases a one-to-many relationship, evident in the interaction between users and their multiple posts.
  - **Many-to-Many with a Join Table**: [Feature/Implementation details to be added when developed]

- **RESTful API**: Our backend features a robust API:
  - **Request Types**: Supports GET (read), POST (create), PATCH (update), and DELETE (remove) requests.
  - **Route Naming**: Proper naming conventions have been followed to maintain clarity and consistency.

- **Database Reset**: The app offers the functionality to reset the database to its default state, aiding in debugging and maintenance.

- **User Experience**:
  - **Redirection**: Seamless redirections are implemented in several user flows for enhanced navigation.
  - **On-Page Interactions**: Features such as creating posts are done without needing to reload or navigate away, enhancing user experience.
  
- **Frontend Routing**: Dynamic frontend routes are crafted using React Router, ensuring appropriate component rendering based on URLs.

- **Hierarchical React Components**:
  - **Component Categorization**: The frontend's React components are organized methodically into specific categories, facilitating better code understanding and maintenance.
  - **Component Types**: The app incorporates both container components (handling logic) and presenter components (handling UI), ensuring a clear separation of concerns.


### Custom Features

- **Filtering and Sorting**:
  - **Role-based Resources**: The application provides filtering options tailored to specific roles in the tech industry. Whether a user is interested in software engineering, product management, or UX design, the resources and discussions can be filtered or sorted to cater to their specific needs.

- **Data Validation**:
  - **Secure Submissions**: Before any data is updated in our database through POST or PATCH requests, the input is validated. For instance:
    - When a user is discussing topics related to "MCAT" or "Medical School", the system checks for content relevance.
    - An if-statement ensures that posts have proper categorization. If a user tries to submit without selecting a category, an error is thrown, ensuring that all posts are properly categorized and easily retrievable.


## Installation Instructions

Login on website

