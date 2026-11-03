import express from "express";
import bookControllers from "../controllers/bookControllers.js";

const router = express.Router();

router.get("/", bookControllers.getListBooks);
router.post("/", bookControllers.addBook);
router.patch("/:id", bookControllers.editBookInfo);
router.patch(":id", bookControllers.editBookStatus);
router.delete("/:id", bookControllers.deleteBook);

export default router;