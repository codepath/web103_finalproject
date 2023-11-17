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

  export interface User {
    accesstoken: string;
    avatarurl: string; 
    githubid: number;
    id: number;
    username: string;
  }