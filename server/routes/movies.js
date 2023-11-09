import express from "express";
import MoviesController from '../controllers/movies.js'

const router = express.Router();

router.get('/', MoviesController.getMovies)
router.get('/:id', MoviesController.getMovie)
router.post('/', MoviesController.createMovie)
router.delete('/:id', MoviesController.deleteMovie)
router.patch('/:id', MoviesController.updateMovie)

export default router;