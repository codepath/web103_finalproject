import React from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';

interface GameItemProps {
  game: Game;
}

const GameCard: React.FC<GameItemProps> = ({ game }) => {
  return (
    <Link to={'/games/' + game.title}>
      <div
        className="
        relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-1 bg-neutral-900/70 cursor-pointer 
        hover:bg-slate-800/50 transition p-2 hover:scale-105 text-white max-h-[400px]"
      >
        <div
          className="
            relative 
            aspect-square 
            w-full
            h-full 
            rounded-md 
            overflow-hidden"
        >
          <img className="object-cover" src={'/game.png'} alt="Image" />
        </div>
        <div className="flex flex-col items-start w-full pt-4 gap-y-1 ">
          <p className="font-semibold truncate w-[245px] overflow-hidden ">
            {game.title}
          </p>

          <p
            className="
            text-neutral-400 
            text-sm 
            pb-4 
            w-full 
            truncate"
          >
            By {game.developer}
          </p>
        </div>
        <div
          className="
          absolute 
          bottom-24 
          right-5"
        >
          {game.platform}
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
