In /server directory:
- run "npm run reset" to reset the database to the initial state with seeding data. Details of seeding data in /server/data directory.
- run "npm run start" to reset the database and start the server
- run "npm run dev" to start the server only. The data on database isn't changed.

ClubHub API has following endpoints. The endpoints with checked are already implemented.

# Clubs

# Events
- [x] /api/events -> get all events, each event includes:
  + id
  + name
  + start_time
  + end_time
  + description
  + capacity
  + registered
- [x] /api/events/:eventId -> all details of event by Id including:
  + id
  + name
  + start_time
  + end_time
  + description
  + capacity
  + registered
  + locations: lists of locations, each has:
    + id
    + name
    + address
  + categories: lists of categories, each has:
    + id
    + name
    + description
  + images: lists of images, each has:
    + id
    + name
    + url
    + taken_date
  + clubs: lists of clubs organizing the event, each has:
    + id
    + name

# Locations
- [x] /api/locations -> get all locations with details
- [x] /api/locations/:locationId -> get details of location by Id
  + id
  + name
  + address

# Categories
- [x] /api/categories -> get all categories with details
- [x] /api/categories/:categoryId -> get details of categories by Id
  + id
  + name
  + description