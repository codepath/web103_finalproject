import express from 'express';

import GamesContoller from '../controllers/games.js';


const router = express.Router();

router.get('/', GamesContoller.getAllGames);
router.get('/:id', GamesContoller.getGameById);
router.post('/', GamesContoller.createGame);
router.put('/:id', GamesContoller.updateGame);
router.delete('/:id', GamesContoller.deleteGame);

export default router;