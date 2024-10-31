# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

Table users {
  id integer [primary key]
  name varchar
  email varchar [unique]
  password varchar
  created_at timestamp
}

Table income {
  id integer [primary key]
  user_id integer
  amount decimal
  source varchar [note: 'Source of income (e.g., salary, investment)']
  date date
}

Table expenses {
  id integer [primary key]
  user_id integer
  category_id integer
  amount decimal
  description varchar [note: 'Description of the expense']
  date date
}

Table categories {
  id integer [primary key]
  name varchar [note: 'Category name (e.g., groceries, rent)']
}

Table savings_goals {
  id integer [primary key]
  user_id integer
  goal_name varchar
  target_amount decimal
  current_amount decimal
  deadline date
}

Table budget_alerts {
  id integer [primary key]
  user_id integer
  limit_amount decimal
  alert_message varchar
}

Table reports {
  id integer [primary key]
  user_id integer
  report_type varchar [note: 'Type of report (e.g., monthly, yearly)']
  date_range varchar [note: 'Date range for the report']
  report_data text [note: 'Data associated with the report']
  created_at timestamp
}

## Add the Entity Relationship Diagram

[![image](https://github.com/user-attachments/assets/a90c4dde-3668-4277-afb9-7df23533b015)]

| Column Name | Type | Description |
|-------------|------|-------------|
| id | integer | primary key |
| name | text | name of the shoe model |
| ... | ... | ... |
