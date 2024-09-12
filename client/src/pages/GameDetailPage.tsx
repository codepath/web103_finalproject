// @ts-nocheck
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import { Game } from '../types';
import axios from 'axios';
import PlatformMapper from '../components/PlatformMapper.tsx';
import { useNavigate } from 'react-router-dom';
import Modal from '../components/Modal.tsx';


const GameDetailPage = () => {
  const { id } = useParams();
  const [game, setGame] = useState<Game>();
  const [editMode, setEditMode] = useState(false);
  const [deleteMode, setDeleteMode] = useState(false);
  const [editedgame, setEditedGame] = useState<Game>({
    name: '',
    developer: '',
    publisher: '',
    rating: '',
    background_image: '',
    genre: [],
    platform: [],
    price: '',
  });
  const Navigate = useNavigate();
  const genreMap = {
    1: 'Action',
    2: 'Adventure',
    3: 'Shooter',
    4: 'Puzzle',
  };

  const platformMap = {
    1: 'PlayStation 5',
    2: 'Xbox-Series-X',
    3: 'PC',
    4: 'Android',
    5: 'Ios',
  };

  const fetchGame = async () => {
    const res = await axios.get(`https://playpal.up.railway.app/games/${id}`);
    const data = res.data;
    return data;
  };

  const handleChange = (e) => {
    if (e.target.name === 'rating' && e.target.value > 5) {
      alert('Rating must be less than or equal to 5');
    } else {
      setEditedGame({ ...editedgame, [e.target.name]: e.target.value });
    }
  };

  const { isPending, isError, data, error } = useQuery({
    queryKey: ['game', id],
    queryFn: fetchGame,
  });

  useEffect(() => {
    if (data) {
      setGame(data);
      setEditedGame({
        name: data.name || '',
        developer: data.developer || '',
        publisher: data.publisher || '',
        rating: data.rating || '',
        background_image: data.background_image || '',
        genre: data.genre || [],
        platform: data.platform || [],
        price: data.price || '',
      });
    }
  }, [data]);

  if (isPending || !game) {
    return <div>Loading...</div>;
  }

  if (isError) {
    return <div>Error: {error.message}</div>;
  }
  const handleDelete = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.delete(`https://playpal.up.railway.app/games/${id}`, editedgame);
      console.log(response.data);
      Navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.patch(`https://playpal.up.railway.app/games/${id}`, editedgame);
      console.log(response.data);
      Navigate('/');
    } catch (err) {
      console.error(err);
    }
  };
  return (
    game && (
      <div className="text-white flex flex-col w-auto gap-5 justify-center items-center text-xl ">
        <div className="text-4xl">{game?.name}</div>
        <img
          src={game?.background_image}
          alt="background"
          className="w-[260px] h-[160px]"
        />
        <div className="bg-black/80 p-2 shadow-sm shadow-slate-300/40 text-white flex rounded-lg flex-col w-auto gap-2 justify-center items-center text-xl">
          <div>Genre : {game?.genre.map((id) => genreMap[id]).join(', ')}</div>
          <div>
            Release Date : {new Date(game?.release_date).toLocaleDateString()}
          </div>
          <div>Rating : {game?.rating}</div>
          <div>Price : {game?.price}</div>
          <div className="flex flex-col items-center">
            Available Platforms <PlatformMapper platforms={game?.platform} />
          </div>
        </div>
        {/*Edit and Delete */}
        <div className="flex gap-10">
          <div className="relative inline-flex group">
            <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#3cb878] via-[#37a33c] to-[#37a33c] rounded-xl blur-sm group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <button
              onClick={() => setEditMode(true)}
              title="Edit"
              className="relative inline-flex items-center justify-center px-8 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
            >
              {' '}
              Edit
              <Modal
                title="Update Game"
                description=""
                isOpen={editMode}
                onChange={setEditMode}
              >
                <form
                  onSubmit={handleSubmit}
                  className="flex flex-col gap-10 justify-center max-w-[700px] w-full  items-center"
                >
                  <input
                    name="name"
                    value={editedgame.name}
                    onChange={handleChange}
                    placeholder="Title"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />

                  <input
                    name="developer"
                    value={editedgame.developer}
                    onChange={handleChange}
                    placeholder="Developer"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />
                  <input
                    name="rating"
                    value={editedgame.rating}
                    onChange={handleChange}
                    placeholder="Rating"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />
                  <input
                    name="background_image"
                    value={editedgame.background_image}
                    onChange={handleChange}
                    placeholder="Background Image"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />
                  <input
                    name="publisher"
                    value={editedgame.publisher}
                    onChange={handleChange}
                    placeholder="Publisher"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />
                  <input
                    name="price"
                    value={editedgame.price}
                    onChange={handleChange}
                    placeholder="Price"
                    className="max-w-[700px] w-full rounded-sm text-black font-semibold"
                  />
                  <button
                    type="submit"
                    className="bg-neutral-600 rounded-lg py-2 px-4 text-xl -m-4 hover:scale-110 transition ease-in-out"
                  >
                    Submit
                  </button>
                </form>
              </Modal>
            </button>
          </div>
          <div className="relative inline-flex  group">
            <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#3cb878] via-[#2ca736] to-[#37a33c] rounded-xl blur-sm group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
            <button
              onClick={() => setDeleteMode(true)}
              title="Delete"
              className="relative inline-flex items-center justify-center px-8 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-gray-900"
              role="button"
            >
              Delete
              <Modal
                title="Delete ? "
                description=" Are you sure you want to delete this game?"
                isOpen={deleteMode}
                onChange={setDeleteMode}
              >
                <div className="flex flex-row items-center justify-center gap-4">
                  <div className="relative inline-flex  group">
                    <div className="absolute transitiona-all duration-1000 opacity-70 -inset-px bg-gradient-to-r from-[#fef88a] via-[#bbf7d0] to-[#22c55e] rounded-xl blur-md group-hover:opacity-100 group-hover:-inset-1 group-hover:duration-200 animate-tilt"></div>
                    <button
                      onClick={handleDelete}
                      title="Get quote now"
                      className="relative inline-flex items-center justify-center px-8 py-2 text-lg font-bold text-white transition-all duration-200 bg-gray-900 font-pj rounded-xl "
                      role="button"
                    >
                      Yes
                    </button>
                  </div>
                </div>
              </Modal>
            </button>
          </div>
        </div>
      </div>
    )
  );
};

export default GameDetailPage;
