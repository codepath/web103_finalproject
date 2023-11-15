import express from "express";
import MoviesTagsController from '../controllers/movies_tags.js'

const router = express.Router();

router.post('/',MoviesTagsController.createMovieTag)
router.get('/:tagid', MoviesTagsController.getMoviesByTag)
router.get('/:movieid', MoviesTagsController.getTagsByMovie)
router.delete('/:movie_id/:tag_id', MoviesTagsController.deleteMovieTag)

export default router;

