import express from "express";
import isAuth from "../middlewares/isAuth.js";

import {
    getOrCreateConversation,
    sendMessage,
    getMessages,
    getConversations,
    markAsRead
} from "../controllers/chatController.js";

const router = express.Router();

// Get or create conversation with educator for a course
router.post("/conversation/:courseId", isAuth, getOrCreateConversation);

// Send a message
router.post("/message", isAuth, sendMessage);

// Get messages for a conversation
router.get("/messages/:conversationId", isAuth, getMessages);

// Get all conversations for current user
router.get("/conversations", isAuth, getConversations);

// Mark conversation as read
router.put("/read/:conversationId", isAuth, markAsRead);

export default router;
