import express from "express";

import {
    getGlobalPost,
    getAllPostsUsers,
    newPost,
    getPost,
    deletePost
} from "../controllers/postsController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, getGlobalPost)
  .get(checkAuth, getAllPostsUsers)
  .post(checkAuth, newPost);

router
 .route("/:id")
  .get(checkAuth, getPost)
  .delete(checkAuth, deletePost);


export default router;
