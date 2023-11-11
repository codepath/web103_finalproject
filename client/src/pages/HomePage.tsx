import { useState, useEffect } from 'react';
import axios from 'axios';
import GenreList from '../components/GenreList';
import { Game } from '../types';
import GameCard from '../components/GameCard';
import { useQuery, useMutation } from '@tanstack/react-query';
import useGameQueryStore from '../store.ts';
import AddGameCard from '../components/AddGameCard.tsx';

const HomePage = () => {
  const [games, setGames] = useState<Game[]>([]);
  const [filteredGames, setFilteredGames] = useState<Game[]>([]);

  const fetchGames = async () => {
    const res = await axios.get('/api/games');
    const data = await res.data;
    return data;
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['games'],
    queryFn: fetchGames,
  });

  const { searchText = '' } = useGameQueryStore((s) => s.gameQuery);
  const { genreId = '' } = useGameQueryStore((s) => s.gameQuery);

  useEffect(() => {
    if (data) {
      setGames(data);
    }
    const filteredGames = data?.filter(
      (game: Game) =>
        game.name?.toLowerCase().includes(searchText.toLowerCase()) &&
        (genreId ? game.genre.includes(Number(genreId)) : true)
    );
    setFilteredGames(filteredGames);
  }, [data, searchText, genreId]);

  if (isError) {
    return <div> Error Fetching games....</div>;
  }
  if (isPending) {
    return <div>Loading...</div>;
  }
  if (filteredGames) {
    return (
      <div className="grid grid-cols-8 lg:grid-cols-aside-main lg:grid-rows-main gap-4">
        <div className="sm:hidden md:grid md:col-start-1">
          <GenreList />
        </div>

        <div className="p-4 md:col-start-2 md:col-span-7 row-start-1 md:row-span-1 grid grid-cols-6 gap-4 sm:col-span-2 ">
          {filteredGames.map((game) => (
            <GameCard game={game} key={game.id} />
          ))}
          <AddGameCard />
        </div>
      </div>
    );
  }

  return (
    data && (
      <div className="grid grid-cols-8 lg:grid-cols-aside-main lg:grid-rows-main gap-4 ">
        <div className="sm:hidden md:grid md:col-start-1 ">
          <GenreList />
        </div>

        <div className="p-4 sm:col-start-2 sm:col-span-4 md:col-start-2 md:col-span-4 row-start-1 grid-cols-6 gap-4 ">
          {games.map((game) => (
            <GameCard game={game} />
          ))}
          <AddGameCard />
        </div>
      </div>
    )
  );
};

export default HomePage;
