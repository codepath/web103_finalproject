# Entity Relationship Diagram

## List of Tables

- **users**
- **recipes**
- **ingredients**
- **recipe_ingredients**
- **favorites**
- **search_history**
- **user_preferences**

## Entity Relationship Diagram
![Entity Relationship Diagram](./entity_relationship_diagram.png)

### Users Table

| Column Name           | Type         | Description                           |
|----------------------|--------------|---------------------------------------|
| user_id              | SERIAL       | Primary key                           |
| username             | VARCHAR(50)  | Unique username                       |
| email                | VARCHAR(100) | Unique email address                  |
| password_hash        | VARCHAR(255) | Hashed password                       |
| dietary_preferences   | JSONB        | User's dietary preferences            |
| created_at           | TIMESTAMP    | Account creation timestamp            |

### Recipes Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| recipe_id         | SERIAL       | Primary key                           |
| title             | VARCHAR(100) | Title of the recipe                   |
| description       | TEXT         | Description of the recipe             |
| spoonacular_id    | INT          | Unique ID from Spoonacular API        |
| image_url         | TEXT         | URL of the recipe image               |
| prep_time         | INT          | Preparation time in minutes            |
| cook_time         | INT          | Cooking time in minutes                |
| servings          | INT          | Number of servings                     |
| created_at        | TIMESTAMP    | Recipe creation timestamp              |

### Ingredients Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| ingredient_id     | SERIAL       | Primary key                           |
| name              | VARCHAR(100) | Unique ingredient name                |

### Recipe Ingredients Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| recipe_id         | INT          | Foreign key referencing recipes       |
| ingredient_id     | INT          | Foreign key referencing ingredients    |
| quantity          | DECIMAL(5,2) | Quantity of the ingredient             |
| unit              | VARCHAR(50)  | Measurement unit                      |
| indexes           | (recipe_id, ingredient_id) [pk] | Primary key composite  |

### Favorites Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| user_id           | INT          | Foreign key referencing users         |
| recipe_id         | INT          | Foreign key referencing recipes       |
| favorited_at      | TIMESTAMP    | Timestamp when the recipe was favorited |
| indexes           | (user_id, recipe_id) [pk] | Primary key composite  |

### Search History Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| search_id         | SERIAL       | Primary key                           |
| user_id           | INT          | Foreign key referencing users         |
| keywords          | TEXT         | Search keywords used                  |
| ingredients       | JSONB        | JSON of ingredients searched          |
| dietary_preferences| JSONB       | User's dietary preferences during search |
| search_time       | TIMESTAMP    | Timestamp of the search               |

### User Preferences Table

| Column Name       | Type         | Description                           |
|-------------------|--------------|---------------------------------------|
| preference_id     | SERIAL       | Primary key                           |
| user_id           | INT          | Foreign key referencing users         |
| preferences       | JSONB        | User-specific preferences              |

