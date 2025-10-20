import express from "express";
import { createDoubtSession, getDoubtSessionByCourse } from "../controllers/doubtSessionController.js";
import isAuth from "../middlewares/isAuth.js";

const doubtSessionRouter = express.Router();

// Define doubt session routes here
doubtSessionRouter.post("/doubt-session", isAuth, createDoubtSession);
doubtSessionRouter.get("/doubt-session/:courseId", isAuth, getDoubtSessionByCourse);

export default doubtSessionRouter;