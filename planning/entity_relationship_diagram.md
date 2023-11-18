# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

Users Table:
UserID (Primary Key)
Username
Password (hashed and salted)
Email
First Name
Last Name
Address
Phone Number
Registration Date

Products Table:
ProductID (Primary Key)
Name
Brand
Description
Price
Size (if sneakers have specific sizes)
Color
Stock Quantity
Category (e.g., running, basketball, casual)
Release Date

Images Table:
ImageID (Primary Key)
ProductID (Foreign Key, references Products)
Image URL (to store links to product images)

Reviews Table:
ReviewID (Primary Key)
ProductID (Foreign Key, references Products)
UserID (Foreign Key, references Users)
Rating (e.g., 1-5 stars)
Review Text
Review Date

Orders Table:
OrderID (Primary Key)
UserID (Foreign Key, references Users)
Order Date
Status (e.g., pending, shipped, delivered)

OrderDetails Table:
OrderDetailID (Primary Key)
OrderID (Foreign Key, references Orders)
ProductID (Foreign Key, references Products)
Quantity
Subtotal (price * quantity)

Payment Table:
PaymentID (Primary Key)
OrderID (Foreign Key, references Orders)
Payment Date
Payment Method (e.g., credit card, PayPal)
Total Amount

## Add the Entity Relationship Diagram

![Database ER diagram (Sneaker World)](https://github.com/faizanx168/web103_finalproject/assets/105330878/a62071d4-ec8c-456d-bf64-8efaa14e5e15)
