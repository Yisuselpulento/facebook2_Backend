import express from "express";

import {
    getMessages,
    sendMessages,
    
} from "../controllers/messagesController.js";
import checkAuth from "../middleware/checkAuth.js";

const router = express.Router();

router.get("/",checkAuth, getMessages)
router.post("/",checkAuth, sendMessages)


export default router;