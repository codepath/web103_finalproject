# Entity Relationship Diagram

This database supports ArcForge's story-planning workspace. A story project contains its own scenes, characters, locations, and story items. Scenes can include multiple characters and items through join tables.

## Create the List of Tables

- **story_projects** — stores the main information for each story project.
- **scenes** — stores scenes that belong to a story project and may take place at a location.
- **characters** — stores character profiles for a story project.
- **locations** — stores reusable story locations for a story project.
- **items** — stores important props or story items for a story project.
- **scene_characters** — join table connecting scenes and characters, including each character's role in a scene.
- **scene_items** — join table connecting scenes and items, including an item's purpose in a scene.

## Add the Entity Relationship Diagram

![ArcForge entity relationship diagram](./entity_relationship_diagram.png)

### Editable Mermaid Version

```mermaid
erDiagram
    STORY_PROJECTS ||--o{ SCENES : contains
    STORY_PROJECTS ||--o{ CHARACTERS : includes
    STORY_PROJECTS ||--o{ LOCATIONS : includes
    STORY_PROJECTS ||--o{ ITEMS : includes
    LOCATIONS o|--o{ SCENES : hosts
    SCENES ||--o{ SCENE_CHARACTERS : has
    CHARACTERS ||--o{ SCENE_CHARACTERS : appears_in
    SCENES ||--o{ SCENE_ITEMS : uses
    ITEMS ||--o{ SCENE_ITEMS : appears_in

    STORY_PROJECTS {
        integer id PK
        varchar title
        text description
        varchar genre
        varchar status
        timestamp created_at
        timestamp updated_at
    }

    SCENES {
        integer id PK
        integer project_id FK
        integer location_id FK
        varchar title
        text summary
        integer scene_order
        integer timeline_order
        varchar status
        varchar mood
        text notes
        timestamp created_at
        timestamp updated_at
    }

    CHARACTERS {
        integer id PK
        integer project_id FK
        varchar name
        varchar story_role
        text description
        text goal
        text knowledge_notes
        timestamp created_at
        timestamp updated_at
    }

    LOCATIONS {
        integer id PK
        integer project_id FK
        varchar name
        text description
        varchar atmosphere
        timestamp created_at
        timestamp updated_at
    }

    ITEMS {
        integer id PK
        integer project_id FK
        varchar name
        text description
        text significance
        timestamp created_at
        timestamp updated_at
    }

    SCENE_CHARACTERS {
        integer scene_id PK, FK
        integer character_id PK, FK
        varchar role_in_scene
        text knowledge_gained
    }

    SCENE_ITEMS {
        integer scene_id PK, FK
        integer item_id PK, FK
        text purpose_in_scene
    }
```

## Relationship Summary

- One **story project** can have many scenes, characters, locations, and items.
- One **location** can be used by many scenes, while a scene can have zero or one location.
- **Scenes** and **characters** have a many-to-many relationship through `scene_characters`.
- **Scenes** and **items** have a many-to-many relationship through `scene_items`.
- The composite primary keys in the join tables prevent the same character or item from being assigned to the same scene more than once.
