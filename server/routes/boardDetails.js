import express from "express";
import BoardDetailsController from "../controllers/boardDetails.js";
import middlewareAuthentication from "../middleware/auth.js";

const router = express.Router();

router.get("/board/:board_id", BoardDetailsController.getBoardByBoardId);
router.get("/board/users/:board_id", BoardDetailsController.getUsersByBoardId);
router.get("/board/tasks/:board_id", BoardDetailsController.getTasksByBoardId);

export default router;
