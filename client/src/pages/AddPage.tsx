import React, { useState } from 'react';
import axios from 'axios';

const GameForm = () => {
  const [game, setGame] = useState({
    name: '',
    developer: '',
    publisher: '',
    rating: '',
    background_image: '',
    release_date: '',
    genre: [],
    platform: [],
    price: '',
  });

  const handleCheckboxChange = (e, field) => {
    if (e.target.checked) {
      setGame({ ...game, [field]: [...game[field], e.target.value] });
    } else {
      setGame({
        ...game,
        [field]: game[field].filter((item) => item !== e.target.value),
      });
    }
  };

  const handleChange = (e) => {
    setGame({ ...game, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post('/api/games', game);
      console.log(response.data);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className=" text-white flex flex-col w-auto gap-10  justify-center items-center ">
      <h1 className="text-4xl pt-4">Add a game</h1>
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-10 justify-center max-w-[700px] w-full  items-center"
      >
        <input
          name="name"
          value={game.name}
          onChange={handleChange}
          placeholder="Title"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />

        <input
          name="developer"
          value={game.developer}
          onChange={handleChange}
          placeholder="Developer"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <input
          name="rating"
          value={game.rating}
          onChange={handleChange}
          placeholder="Rating"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <input
          name="background_image"
          value={game.background_image}
          onChange={handleChange}
          placeholder="Background Image"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <input
          name="publisher"
          value={game.publisher}
          onChange={handleChange}
          placeholder="Publisher"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <input
          name="release_date"
          value={game.release_date}
          onChange={handleChange}
          placeholder="Release Date"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <input
          name="price"
          value={game.price}
          onChange={handleChange}
          placeholder="Price"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold"
        />
        <h1 className="text-lg -m-6 rounded-lg px-2">Genre</h1>
        <div className="max-w-[700px] w-full rounded-sm font-semibold flex justify-around">
          <label>
            <input
              type="checkbox"
              value="1"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Action
          </label>
          <label>
            <input
              type="checkbox"
              value="2"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Adventure
          </label>
          <label>
            <input
              type="checkbox"
              value="2"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Shooter
          </label>
          <label>
            <input
              type="checkbox"
              value="2"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Puzzle
          </label>
        </div>
        <h1 className="text-lg -m-6 rounded-lg px-1">Platforms</h1>
        <div className="max-w-[700px] w-full rounded-sm font-semibold flex justify-around">
          <label>
            <input
              type="checkbox"
              value="1"
              onChange={(e) => handleCheckboxChange(e, 'platform')}
            />{' '}
            PlayStation 5
          </label>
          <label>
            <input
              type="checkbox"
              value="2"
              onChange={(e) => handleCheckboxChange(e, 'platform')}
            />{' '}
            Xbox-Series-X
          </label>
          <label>
            <input
              type="checkbox"
              value="3"
              onChange={(e) => handleCheckboxChange(e, 'platform')}
            />{' '}
            PC
          </label>
          <label>
            <input
              type="checkbox"
              value="4"
              onChange={(e) => handleCheckboxChange(e, 'platform')}
            />{' '}
            Android
          </label>
          <label>
            <input
              type="checkbox"
              value="5"
              onChange={(e) => handleCheckboxChange(e, 'platform')}
            />{' '}
            Ios
          </label>
        </div>
        <button
          type="submit"
          className="bg-neutral-600 rounded-lg py-2 px-4 text-xl -m-4 hover:scale-110 transition ease-in-out"
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GameForm;
