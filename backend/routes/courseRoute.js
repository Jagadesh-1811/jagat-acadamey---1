import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { createCourse, createLecture, editCourse, editLecture, getCourseById, getLecturesByCourseId, getCreatorById, getCreatorCourses, getPublishedCourses, removeCourse, removeLecture, getLectureById } from "../controllers/courseController.js"
import upload from "../middlewares/multer.js"

let courseRouter = express.Router()

courseRouter.post("/create",isAuth,createCourse)
courseRouter.get("/getpublishedcoures",getPublishedCourses)
courseRouter.get("/getcreatorcourses",isAuth,getCreatorCourses)
courseRouter.post("/editcourse/:courseId",isAuth,upload.single("thumbnail"),editCourse)
courseRouter.get("/getcourse/:courseId",isAuth,getCourseById)
courseRouter.delete("/removecourse/:courseId",isAuth,removeCourse)
courseRouter.post("/createlecture/:courseId",isAuth,createLecture)
courseRouter.get("/getcourselectures/:courseId",isAuth,getLecturesByCourseId)
courseRouter.post("/editlecture/:lectureId",isAuth,upload.single("videoUrl"),editLecture)
courseRouter.delete("/removelecture/:lectureId",isAuth,removeLecture)
courseRouter.post("/getcreator",getCreatorById)
courseRouter.get("/getlecture/:lectureId",isAuth,getLectureById)







export default courseRouter