// @ts-nocheck
import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const GameForm = () => {
  const [disableButton, setDisableButton] = useState(false);
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
  const Navigate = useNavigate();

  const alertRatings = () =>
    toast.error('Ratings must be less than 5!', {
      position: toast.POSITION.TOP_CENTER,
    });
  const alertButton = () =>
    toast.error('Button Disabled!', {
      position: toast.POSITION.TOP_CENTER,
    });
  const addedGame = () =>
    toast.success('Game Added Successfully!', {
      position: toast.POSITION.TOP_CENTER,
    });

  const handleCheckboxChange = (e, field) => {
    const value = Number(e.target.value);
    if (e.target.checked) {
      setGame({ ...game, [field]: [...game[field], value] });
    } else {
      setGame({
        ...game,
        [field]: game[field].filter((item) => item !== value),
      });
    }
  };

  const handleChange = (e) => {
    if (e.target.name === 'rating' && e.target.value > 5) {
      alertRatings();
      alertButton();
      setDisableButton(true);
      setGame({ ...game, [e.target.name]: e.target.value });
    } else {
      setDisableButton(false);
      setGame({ ...game, [e.target.name]: e.target.value });
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      console.log(game);
      const response = await axios.post('https://playpal.up.railway.app/games', game);
      console.log(response.data);
      addedGame();
      Navigate('/');
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className=" text-white flex flex-col w-auto gap-10 pb-10  justify-center items-center ">
      <h1 className="text-4xl pt-2">Add a game</h1>
      <ToastContainer autoClose={1000} />
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-8 justify-center max-w-[700px] w-full  items-center"
      >
        <input
          name="name"
          value={game.name}
          onChange={handleChange}
          placeholder="Title"
          className="max-w-[700px] w-full rounded-sm text-black font-semibold focus-outline-none"
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
              value="3"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Shooter
          </label>
          <label>
            <input
              type="checkbox"
              value="4"
              onChange={(e) => handleCheckboxChange(e, 'genre')}
            />{' '}
            Puzzle
          </label>
        </div>
        <ToastContainer autoClose={1000} />
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
          className="bg-green-600 rounded-lg py-2 px-4 text-xl -m-4 hover:scale-110 transition ease-in-out"
          disabled={disableButton}
        >
          Submit
        </button>
      </form>
    </div>
  );
};

export default GameForm;
