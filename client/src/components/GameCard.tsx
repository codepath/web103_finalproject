import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Game } from '../types';
import PlatformMapper from './PlatformMapper'

interface GameItemProps {
  game: Game;
}

const GameCard: React.FC<GameItemProps> = ({ game }) => {
  return (
    <Link to={'/games/' + game.name}>
      <div
        className="
        relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-1 bg-neutral-900/70 cursor-pointer 
        hover:bg-slate-800/50 transition p-2 hover:scale-105 text-white max-h-[400px] h-auto tansition ease-in-out duration-300"
      >
        <div
          className="
            relative 
            w-full
            h-auto
            rounded-md 
            overflow-hidden"
        >
          <img
            className=""
            src={game.background_image|| ''}
            alt="Image"
          />
        </div>
        <div className="flex flex-col items-start w-full pt-4 gap-y-1 ">
          <p className="font-semibold truncate w-[245px] overflow-hidden hover:text-pink-500 transition ">
            {game.name}
          </p>

          <p
            className="
            text-neutral-400 
            text-sm 
            pb-2 
            w-full 
            truncate"
          >
            By {game.developer}
          </p>
        </div>
        <div
          className="flex flex-col w-full"
        >
          <PlatformMapper platforms={game.platform} />
        </div>
      </div>
    </Link>
  );
};

export default GameCard;
