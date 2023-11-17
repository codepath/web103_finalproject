# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]
1. Readers table
2. Books table
3. Readers-Books table
4. Reviews table
   

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

| Readers | Type | Description |
|-------------|------|-------------|
| id | serial | primary key |
| name | varchar(100) |  |
| address | text |  |
| tel| text |  |
| bio| text |  |


| Books | Type | Description |
|-------------|------|-------------|
| id | serial | primary key |
| name | varchar(100) |  |
| author | varchar(100) |  |
| description| text |  |


| Readers-Books | Type | Description |
|-------------|------|-------------|
| readerID | int| primary key, foreign key |
| bookID | int | primary key, foreign key |


| Reviews| Type | Description |
|-------------|------|-------------|
| id | serial| primary key |
| review | text |  |
| rating | int |  |
| readerID | int| foreign key |
| bookID | int | foreign key |





![image](https://github.com/XujuanChen/web103_finalproject/assets/109524796/28ab39aa-b0df-49ef-95b5-e344bd530946)
