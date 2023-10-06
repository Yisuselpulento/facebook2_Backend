import express from "express";

import {
    getGlobalComment,
    newComment,
    deleteComment
} from '../controllers/commentController.js'
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();


router
  .route("/")
  .get(checkAuth, getGlobalComment)
  .post(checkAuth, newComment);

router.delete("/:id", checkAuth, deleteComment)



export default router;
