import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createQuiz, getQuizzesByCourse, getQuizById, updateQuiz, deleteQuiz } from "../controllers/quizController.js";

const router = express.Router();

router.route("/create/:courseId").post(isAuth, createQuiz);
router.route("/course/:courseId").get(isAuth, getQuizzesByCourse);
router.route("/:quizId").get(isAuth, getQuizById);
router.route("/:quizId").put(isAuth, updateQuiz);
router.route("/:quizId").delete(isAuth, deleteQuiz);

export default router;
