import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { IoMdAdd } from 'react-icons/io';

const AddGameCard = () => {
  return (
    <Link to={'/addgame'} >
    <div
      className="
        relative group flex flex-col items-center justify-center rounded-md overflow-hidden gap-x-1 bg-neutral-900/70 cursor-pointer 
        hover:bg-slate-800/50 transition p-2 hover:scale-105 text-white max-h-[400px] h-[243px] tansition ease-in-out duration-300"
    >
        <IoMdAdd size={250} color={"white"} />
      <div className="flex flex-col items-center justify-center w-full pt-4 gap-y-1 ">
        <p className="font-semibold flex flex-col items-center justify-center truncate w-[245px] overflow-hidden hover:text-pink-500 transition ">
          Add Game
        </p>
      </div>
      <div className="flex flex-col w-full"></div>
    </div>
    </Link>
  );
};

export default AddGameCard;
