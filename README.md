# BookEZ

CodePath WEB103 Final Project

Designed and developed by: Chengtao Lin, Parth Kansara, Thanh Nguyen Do

🔗 Link to deployed app:

## About

### Description and Purpose

BookEZ is an easy-to-use online booking platform designed specifically for nail salons. It simplifies the appointment scheduling process for both customers and salon staff. With features like user authentication, browsing available salons, selecting preferred nail technicians, and booking appointments, BookEZ ensures a smooth and personalized experience. The application aims to streamline salon operations by automating appointment management and providing clear communication between salons and their clients.

### Inspiration

The idea for BookEZ came from the challenges many people face when booking appointments at their favorite nail salons. Often, scheduling is done over the phone or through manual systems, leading to double bookings, missed appointments, and confusion. BookEZ was inspired by the need for a more efficient, user-friendly solution that allows customers to easily browse salons, select their preferred technicians, and secure their desired time slots with just a few clicks. It also helps salons by reducing administrative tasks.

## Tech Stack

Frontend: React.js, Boostrap 5.

Backend: Express.js, PostgreSQL, RailWay, Node.js.

## Features

### PostgreSQL Database Management

- [x] Set up and manage a PostgreSQL database with structured tables for users, salons, employees, bookings, and time slots. This feature includes robust reset and seeding capabilities, enabling developers to easily reset tables and populate them with initial mock data, ensuring a consistent database state for testing and development.

![DB Table GIF](https://github.com/Web103-BookEZ/web103_finalproject/blob/main/gifs/db_walkthrough.gif)

### Authorization

- [x] Allow users to securely create accounts, log in, and log out to access the booking system and manage their information.

- Login Page: 
![LoginPageRecord](https://github.com/user-attachments/assets/1645619d-8b35-4311-8ae8-732c08821352)

- Signup Page:
![SignUpPage](https://github.com/user-attachments/assets/a87f806b-28a2-4154-8b6d-0ff4c7f1ea59)


### Home Page - List All Stores

- [x] Display a list of all available nail salons, including basic information like name and address, to help users choose where to book an appointment.

- Demo of home page
![Homepage](https://github.com/user-attachments/assets/e625ab42-06d3-4ff8-894b-250628c751bb)

### Store Details - List All Employees

- [ ] Show a list of employees at each selected salon, providing users with information about each employee’s name and specialties as well as the salon's details including title, address, and available time.

[gif goes here]

### Employee Availability

- [x] Display the available time slots for each selected employee, making it easy for users to choose a convenient time for their appointment.
![EmployeeAvailability](https://github.com/user-attachments/assets/71dda37f-d44e-44d2-bf98-84f4d4ce1052)


### Book Appointment

- [x] Allow users to select an available time slot and confirm their booking. Ensure that users receive a confirmation when the booking is successful.
![Booking](https://github.com/user-attachments/assets/f2e8f0d4-61f5-4623-9094-823ddd57a4dc)

### Email Notifications

- [ ] Automatically send an email to the salon notifying them of a new booking, send a confirmation email to the user for their records, and notifying users of upcoming appointments.

### User Profile - View Bookings

- [ ] Enable users to see a list of all their current and upcoming bookings, including details like date, time, salon, and technician.
- [ ] Showing current user's personal profile information including their full name, username, email, and phone number. The user can also update their information if needed.

### Modify and Cancel Bookings

- [ ] Allow users to view or cancel their bookings if their plans change, providing flexibility in managing appointments.

### Search and Filter

- [ ] Allow users to search for salons by name or location and filter results based on ratings, services offered, or distance.

### User Reviews and Ratings

- [ ] Provide a platform for users to leave reviews for salons and display ratings to help other users make informed choices.

## Installation Instructions

[instructions go here]
