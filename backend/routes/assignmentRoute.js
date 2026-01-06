import express from "express";
import isAuth from "../middlewares/isAuth.js";
import { createAssignment, gradeAssignment } from "../controllers/assignmentController.js";

const router = express.Router();

router.route("/create/:courseId").post(isAuth, createAssignment);
router.route("/grade/:assignmentId").post(isAuth, gradeAssignment);

export default router;