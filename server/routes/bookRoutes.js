import express from "express";
import bookControllers from "../controllers/bookControllers.js";

const router = express.Router();

router.get("/:listId", bookControllers.getListBooks);
router.post("/:listId", bookControllers.addBook);
router.patch("/edit/:bookId", bookControllers.editBookInfo);
router.patch("/:bookId", bookControllers.editBookStatus);
router.delete("/:bookId", bookControllers.deleteBook);

export default router;