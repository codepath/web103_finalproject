# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

[👉🏾👉🏾👉🏾 List each table in your diagram]

1. `route_holds`

2. `climbing_holds`

3. `wall_types`

4. `climbing_routes`

## Add the Entity Relationship Diagram

[👉🏾👉🏾👉🏾 Include an image or images of the diagram below. You may also wish to use the following markdown syntax to outline each table, as per your preference.]

![ERD](<Custom Climbing Route Maker.svg>)

```sql
Project custom_climbing_route_maker {
  database_type: 'PostgreSQL'
  Note: 'Entity Relationship Diagram for Capstone Web 103 Project'
}

enum wall_angles {
  slab
  vertical
  overhang
  roof
}

enum grades {
  V0
  V1
  V2
  V3
  V4
  V5
  V6
  V7
  V8
  V9
  V10
  V11
  V12
}

enum hold_types {
  crimp
  jug
  sloper
  pocket
  pinch
}

enum hold_sizes {
  small
  medium
  large
}

enum hold_roles {
  start
  hand
  foot
  any
  finish
}

Table wall_types {
  id integer [primary key, increment]
  name Wall_Angles [not null, unique]
  min_angle integer
  max_angle integer
  description varchar
}

Table climbing_routes {
  id integer [primary key, increment]
  name varchar [not null]
  grade Grades [not null]
  angle_degrees integer [not null, note: 'e.g. -10, 0, 30, 45']
  wall_type_id integer [not null]
  created_at timestamptz [not null, default: `now()`]
}

Table climbing_holds {
  id integer [primary key, increment]
  name varchar [not null]
  hold_type Hold_Types
  size Size
  color varchar [not null]
  image_url text [note: 'points to /holds/*.png']
}

Table route_holds {
  id integer [primary key, increment]
  route_id integer [not null]
  hold_id integer [not null]
  grid_row integer [not null, note: 'CHECK 0..15']
  grid_col integer [not null, note: 'CHECK 0..11']
  role Roles
  rotation integer [not null, default: 0]

  indexes {
    (route_id, grid_row, grid_col) [unique, name: 'unique_hold_position_per_route']
  }
}

// One-to-many: one wall type has many routes
Ref: climbing_routes.wall_type_id > wall_types.id

// Many-to-many via join table: two many-to-one links
Ref: route_holds.route_id > climbing_routes.id [delete: cascade]
Ref: route_holds.hold_id > climbing_holds.id [delete: cascade]
```
