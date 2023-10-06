import express from "express";

import {
  getComments,
    newComment,
    deleteComment
} from '../controllers/commentController.js'
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router.post("/:postId", checkAuth , newComment)
router.get("/:postId", checkAuth , getComments)
router.delete("/:commentId", checkAuth, deleteComment)





export default router;
