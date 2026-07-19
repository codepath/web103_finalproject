# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

---

## Create the List of Tables

- users  
- industries  
- companies  
- stories  
- tags  
- story_tags  

## 1. users

Stores information about authenticated users who can submit layoff stories.

| Field       | Type         | Description                              | Constraints            |
|------------|-------------|------------------------------------------|------------------------|
| user_id     | SERIAL      | Unique identifier for the user           | Primary Key            |
| email       | VARCHAR(255)| User’s email address                     | Not Null, Unique       |
| name        | VARCHAR(100)| User’s display name                      | Not Null               |
| created_at  | TIMESTAMP   | Time the account was created             | Default: CURRENT_TIMESTAMP |

## 2. companies

Stores information about companies associated with layoff entries.

| Field      | Type         | Description       | Constraints       |
|-----------|-------------|---------------------|--------------------|
| company_id | SERIAL | Unique identifier for the company |PK              |
| name       | VARCHAR(100)| Name of the company | Not Null, Unique         |
| location   | VARCHAR(100)| Company location    | Nullable                 |
| website    | VARCHAR(255)| Company website or logo URL  | Nullable        |

---

## 3. industries

Stores the possible industries a company can belong to.

| Field        | Type         | Description            | Constraints        |
|-------------|-------------|---------------------------|--------------------|
| industry_id  | SERIAL      | Unique identifier for industry | PK  |
| name         | VARCHAR(100)| Name of the industry     | Not Null, Unique   |

---

## 4. company_industry

Establishes a many-to-many relationship between companies and industries.

| Field       | Type | Description           | Constraints                  |
|------------|------|-------------------------------------- ------------------------------|
| company_id  | INT  | Foreign key referencing companies | Foreign Key, On Delete Cascade |
| industry_id | INT  | Foreign key referencing industries   | Foreign Key, On Delete Cascade |

**Primary Key:** (company_id, industry_id)

---

# Entity Relationship Diagram

## Create the List of Tables

- users
- companies
- industries
- company_industry
- entries

---

## 1. users

Stores information about authenticated users who can submit layoff stories.

| Field       | Type         | Description                              | Constraints                    |
|------------|-------------|------------------------------------------|--------------------------------|
| user_id     | SERIAL      | Unique identifier for the user           | Primary Key                    |
| email       | VARCHAR(255)| User’s email address                     | Not Null, Unique               |
| name        | VARCHAR(100)| User’s display name                      | Not Null                       |
| created_at  | TIMESTAMP   | Time the account was created             | Default: CURRENT_TIMESTAMP     |

---

## 2. companies

Stores information about companies associated with layoff entries.

| Field      | Type         | Description                              | Constraints              |
|-----------|-------------|------------------------------------------|--------------------------|
| company_id | SERIAL      | Unique identifier for the company        | Primary Key              |
| name       | VARCHAR(100)| Name of the company                      | Not Null, Unique         |
| location   | VARCHAR(100)| Company location or headquarters         | Nullable                 |
| website    | VARCHAR(255)| Company website or logo URL              | Nullable                 |

---

## 3. industries

Stores the possible industries a company can belong to.

| Field        | Type         | Description                  | Constraints        |
|-------------|-------------|------------------------------|--------------------|
| industry_id  | SERIAL      | Unique identifier for industry| Primary Key        |
| name         | VARCHAR(100)| Name of the industry         | Not Null, Unique   |

---

## 4. company_industry

Establishes a many-to-many relationship between companies and industries.

| Field       | Type | Description                          | Constraints                  |
|------------|------|--------------------------------------|------------------------------|
| company_id  | INT  | Foreign key referencing companies    | Foreign Key, On Delete Cascade |
| industry_id | INT  | Foreign key referencing industries   | Foreign Key, On Delete Cascade |

**Primary Key:** (company_id, industry_id)

---

## 5. entries

Stores the actual layoff stories submitted by users.

| Field   | Type      | Description   |  Constraints                     |
|-------- |-----------|--------------------------------------------------|--------------------------------------|
| entry_id | SERIAL  | Unique identifier for the layoff entry         | Primary Key                          |
| user_id  | INT     | Foreign key referencing the user               | Not Null                             |
| company_id | INT   | Foreign key referencing the company            | Not Null                             |
| job_title  | VARCHAR(100)| Job title of the person laid off         | Not Null                             |
| job_type   | VARCHAR(50) | Type of job (full-time, contract, etc.)  | Not Null                             |
| job_search_duration | VARCHAR(50) | Time it took to find a new job  | Nullable                             |
| experience_description | TEXT | Written description of the layoff experience | Not Null                    |
| date_of_layoff | DATE   | Date the layoff occurred                  | Not Null                             |
| severance_weeks| INT    | Number of weeks of severance received     | Not Null, Check ≥ 0                  |
| is_anonymous   | BOOLEAN  | Whether the story is posted anonymously | Default: false                       |
| post_date      | TIMESTAMP   | Time the entry was submitted         | Default: CURRENT_TIMESTAMP           |

---

## Relationships

- Users → Entries: One-to-Many  
- Companies → Entries: One-to-Many  
- Companies ↔ Industries: Many-to-Many (via company_industry)

---

## Add the Entity Relationship Diagram

![ERD Diagram](images/ERD_Layoff.pdf)