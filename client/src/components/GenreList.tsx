import { useState } from 'react';
import useGameQueryStore from '../store';

const GenreList = () => {
  //   const { data, isLoading, error } = useGenres()

  //   const selectedGenreId = useGameQueryStore(s => s.gameQuery.genreId)
  //   const setSelectedGenreId = useGameQueryStore(s => s.setGenreId)

  //   if (error) return null

  //   if (isLoading) return <div className="spinner"></div>
  const data = [
    {
      id: 1,
      name: 'Action',
    },
    {
      id: 2,
      name: 'Adventure',
    },
    {
      id: 3,
      name: 'Shooter',
    },
    {
      id: 4,
      name: 'Puzzle',
    }
  ];
  const resetFilters = () => {
    setSearchText('');
    setSelectedGenreId(0);
  };
  const setSearchText = useGameQueryStore(s => s.setSearchText)
  const setSelectedGenreId = useGameQueryStore(s => s.setGenreId);
  return (
    <>
      <div className="bg-black/50 h-[calc(100vh-65px)] overflow-hidden pl-4">
        <h2 className="text-2xl text-white mt-9 mb-3 font-bold">Genres</h2>
        <ul>
          {data?.map((genre) => (
            <li key={genre.id} className="py-2 text-white font-bold  ">
              <div className="flex">
                <button
                  className={`text-left normal-case hover:scale-125 tansition ease-in-out duration-300 `}
                  onClick={() => setSelectedGenreId(genre.id)}
                >
                  {genre.name}
                </button>
              </div>
            </li>
          ))}
        </ul>
        <button onClick={resetFilters} className=" text-white font-bold text-left normal-case hover:scale-125 py-2 mt-4 bg-green-700 tansition ease-in-out duration-300 rounded-md px-2 ">Reset Filters</button>
      </div>
    </>
  );
};

export default GenreList;
