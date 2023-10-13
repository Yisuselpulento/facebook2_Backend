import express from "express";

import {
    getGlobalPost,
    newPost,
    deletePost,
    giveLike
} from "../controllers/postsController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router
  .route("/")
  .get(checkAuth, getGlobalPost)
  .post(checkAuth, newPost);

router.put("/:id/like" ,  checkAuth, giveLike)

router
 .route("/:id")
  .delete(checkAuth, deletePost);


export default router;
