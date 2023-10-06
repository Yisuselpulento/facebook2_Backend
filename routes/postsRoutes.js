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
  .post(checkAuth, newPost);

router.get("/:userId" ,  checkAuth, getAllPostsUsers)

router
 .route("/:id")
  .get(checkAuth, getPost)
  .delete(checkAuth, deletePost);


export default router;
