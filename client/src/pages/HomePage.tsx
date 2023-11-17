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
      <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 grid-cols-4 lg:grid-cols-aside-main lg:grid-rows-main gap-4">
        <div className="hidden md:grid md:col-start-1">
          <GenreList />
        </div>
        <div className="p-4 md:col-start-2 h-fit md:col-span-7 row-start-1 grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:col-span-4 sm:grid-cols-2">
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
      <div className="grid sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-8 grid-cols-4 lg:grid-cols-aside-main lg:grid-rows-main gap-4">
        <div className="hidden md:grid md:col-start-1">
          <GenreList />
        </div>

        <div className="p-4 md:col-start-2 h-fit md:col-span-7 row-start-1 grid md:grid-cols-2 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:col-span-4 sm:grid-cols-2">
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