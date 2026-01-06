import express from "express";
import isAuth from "../middlewares/isAuth.js";
import {
    createModule,
    getModulesByCourseId,
    updateModule,
    deleteModule,
    reorderModules,
    createLectureInModule,
    reorderLectures
} from "../controllers/moduleController.js";

const moduleRouter = express.Router();

// Module CRUD
moduleRouter.post("/create/:courseId", isAuth, createModule);
moduleRouter.get("/course/:courseId", isAuth, getModulesByCourseId);
moduleRouter.put("/:moduleId", isAuth, updateModule);
moduleRouter.delete("/:moduleId", isAuth, deleteModule);
moduleRouter.post("/reorder/:courseId", isAuth, reorderModules);

// Lecture within module
moduleRouter.post("/:moduleId/lecture", isAuth, createLectureInModule);
moduleRouter.post("/:moduleId/reorder-lectures", isAuth, reorderLectures);

export default moduleRouter;
