ClubHub API has following endpoints. The endpoints with checked are already implemented.

# Clubs

# Events
- [ ] /api/events -> get all events with details
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