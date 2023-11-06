# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

1. User Table
2. Company table
3. Post Table
4. Jobs Table

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

![image (6)](https://github.com/mumtazf/careerPortal/assets/80971217/a0773a45-2abc-429f-8194-1641545b7459)

## User table
| Column Name | Type | Description |
|-------------|------|-------------|
| Github_ID | text | primary key |
| Username | text | name of the shoe model |
| AvatarUrl | text | The Avatar URL for each user |
| AccessToken | text | Each user's access token |
| savedJobs | dictionary | A distionary containing the User's saved jobs |
| Job_ID | text | A foreign Key |
| Is_saved | boolean | This tells us if the job is currently saved |
| Role | text | Student, Early career etc. |

## company table
| Column Name | Type | Description |
|-------------|------|-------------|
| Github_ID | integer | foreign key |
| Company_ID | text | primary key |
| Picture_URL | text | The company's background picture URL |
| Description | text | The company's description |

## post table
| Column Name | Type | Description |
|-------------|------|-------------|
| Github_ID | text | foreign key |
| Post_ID | text | primary key |
| Title | text | The Post Title |
| Body | text | Body of the post |
| Likes | array | A List of users who liked the post |
| Pending | boolean | If the admins have approved it |


## job table
| Column Name | Type | Description |
|-------------|------|-------------|
| Job_ID | text | primary key |
| Company_ID | text | foreign key |
| Type | text | Is it a conference, a job? |
| Category | text |Freshman, sophomore or newgrad? |
| Description | text | A Job description |
| Role | text | A role description |
| Location | text | This tells us the job location |
| Remote | boolean | Remote or not. |
| Pay range | text | This tells us the pay range |
| URL redirection | text |This url redirects us to the actual job application. |

| ... | ... | ... |
