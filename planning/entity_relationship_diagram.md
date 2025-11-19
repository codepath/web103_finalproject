# Entity Relationship Diagram

Reference the Creating an Entity Relationship Diagram final project guide in the course portal for more information about how to complete this deliverable.

## Create the List of Tables

1.  **users**: Stores user authentication and profile information.
2.  **journals**: Stores collections of pages (e.g., "My Travels Journal"). This has a **one-to-many** relationship with users.
3.  **pages**: Stores the individual memory entries or scrapbook pages, including text, photo URLs, dates, and locations. This has a **one-to-many** relationship with journals.
4.  **stickers**: Stores the reference library of digital stickers available for use on pages.
5.  **pagestickers**: This is the **join table** handling the **many-to-many** relationship between pages and stickers. It also includes custom fields for sticker position and rotation.
6.  **moodsongs**: Stores the Spotify song metadata linked to a page. This is the **one-to-one** relationship with pages.

## Add the Entity Relationship Diagram

<img width="455" height="229" alt="image" src="https://github.com/user-attachments/assets/7b4782ae-0996-48e8-8ff3-e7620876bdba" />


