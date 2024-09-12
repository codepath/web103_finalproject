import { create } from 'zustand';
interface GameQuery {
  searchText?: string;
  genreId?: number | null;
}

interface GameQueryStore {
  gameQuery: GameQuery;
  setSearchText: (searchText: string) => void;
  setGenreId: (genreId: number) => void;
}

const useGameQueryStore = create<GameQueryStore>((set) => ({
  gameQuery: {},
  setSearchText: (searchText) => set(() => ({ gameQuery: { searchText } })),
  setGenreId: (genreId) =>
    set((store) => ({
      gameQuery: { ...store.gameQuery, genreId, searchText: undefined },
    })),
}));

export default useGameQueryStore;
