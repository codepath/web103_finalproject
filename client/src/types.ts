export interface Game {
    id: number;
    name: string;
    developer: string;
    publisher: string;
    release_date: Date;
    rating: number;
    background_image: string;
    genre: number[];
    platform: number[];
    short_screenshots: { id: number, image: string }[];
  }
