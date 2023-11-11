export interface Game {
    id: number;
    name: string;
    developer: string;
    publisher: string;
    release_date: Date;
    rating: number;
    price:string;
    background_image: string;
    genre: number[];
    platform: number[];
  }
