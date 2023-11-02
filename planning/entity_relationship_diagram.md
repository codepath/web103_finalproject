## List of Tables:

### USER
| Column Name | Type      | Description               |
|-------------|-----------|---------------------------|
| id          | integer   | primary key               |
| username    | varchar   | user's unique username   |
| password    | varchar   | user's encrypted password|

### POST
| Column Name | Type      | Description               |
|-------------|-----------|---------------------------|
| id          | integer   | primary key               |
| content     | text      | content of the post      |
| userId      | int       | foreign key to USER       |

### COMMENT
| Column Name | Type      | Description               |
|-------------|-----------|---------------------------|
| id          | integer   | primary key               |
| content     | text      | content of the comment   |
| postId      | int       | foreign key to POST       |

### RESOURCE
| Column Name | Type      | Description               |
|-------------|-----------|---------------------------|
| id          | integer   | primary key               |
| link        | varchar   | URL of the resource      |
| typeId      | int       | foreign key to TYPE       |
| userId      | int       | foreign key to USER       |

### TYPE
| Column Name | Type      | Description               |
|-------------|-----------|---------------------------|
| id          | integer   | primary key               |
| name        | varchar   | type of the resource      |


# Entity Relationship Diagram

This ERD visually represents the relationships between the main entities in our application:

- **USER**: Represents the registered users of the platform.
- **POST**: Represents the posts created by users.
- **COMMENT**: Represents comments on posts.
- **RESOURCE**: Represents the learning resources added by users.
- **TYPE**: Represents the type of resource (e.g., "Videos" or "Articles").

<img src='https://github.com/Myesha-Mahazabeen/web103_finalproject/blob/main/ERD%20WEB%20DEV%20103.png' title='Video Walkthrough' width='' alt='ERD' />

