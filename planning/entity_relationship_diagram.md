# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

1. Users
2. Movie
3. Wishlist
4. Tag
5. Movie Tag

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

### Entities and Attributes:

1. **User:**

| Column Name   | Type    | Description                 |
|---------------|---------|-----------------------------|
| user_id       | integer | primary key                 |
| username      | text    | user's login name           |
| password      | text    | user's password             |
| email         | text    | user's email address        |
| ...           | ...     | ...                         |

2. **Movie:**

| Column Name   | Type    | Description                 |
|---------------|---------|-----------------------------|
| movie_id      | integer | primary key                 |
| title         | text    | title of the movie          |
| director      | text    | director of the movie       |
| actors        | text    | list of actors              |
| published_date| date    | date the movie was published|
| ...           | ...     | ...                         |

3. **Wishlist:**

| Column Name   | Type    | Description                 |
|---------------|---------|-----------------------------|
| wishlist_id   | integer | primary key                 |
| user_id       | integer | foreign key (User)          |
| name          | text    | name of the wishlist        |
| ...           | ...     | ...                         |

4. **Tag:**

| Column Name   | Type    | Description                 |
|---------------|---------|-----------------------------|
| tag_id        | integer | primary key                 |
| name          | text    | name of the tag             |
| ...           | ...     | ...                         |

5. **Movie_Tag:**

| Column Name   | Type    | Description                 |
|---------------|---------|-----------------------------|
| movie_tag_id  | integer | primary key                 |
| movie_id      | integer | foreign key (Movie)         |
| tag_id        | integer | foreign key (Tag)           |
| ...           | ...     | ...                         |

#### Relationships:

- **User to Movie**: One to Many (A user can create multiple movies, but each movie is created by one user)
- **User to Wishlist**: One to One (A user can have multiple wishlists, but each wishlist belongs to one user)
- **Wishlist to Movie**: Many to Many (A wishlist can have multiple movies and a movie can be in multiple wishlists)
- **Movie to Tag**: Many to Many (A movie can have multiple tags and a tag can be associated with multiple movies)