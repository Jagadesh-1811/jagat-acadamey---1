import express from "express";
import { createFeedback, getAllFeedback, updateFeedbackStatus, deleteFeedback, getUserFeedback } from "../controllers/feedbackController.js";

const feedbackRouter = express.Router();

// Public route - anyone can submit feedback
feedbackRouter.post("/submit", createFeedback);

// Get feedback by user email
feedbackRouter.get("/user/:email", getUserFeedback);

// Admin routes
feedbackRouter.get("/all", getAllFeedback);
feedbackRouter.patch("/status/:id", updateFeedbackStatus);
feedbackRouter.delete("/:id", deleteFeedback);

export default feedbackRouter;
