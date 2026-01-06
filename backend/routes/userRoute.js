import express from "express"
import isAuth from "../middlewares/isAuth.js"
import { getCurrentUser, UpdateProfile, getResume, updateResume, getCertifications, submitCertification, getGrades, getUserById } from "../controllers/userController.js"
import upload from "../middlewares/multer.js"



let userRouter = express.Router()

userRouter.get("/currentuser", isAuth, getCurrentUser)
userRouter.post("/updateprofile", isAuth, upload.single("photoUrl"), UpdateProfile)
userRouter.get("/profile/:userId", isAuth, getUserById)

userRouter.get("/resume", isAuth, getResume);
userRouter.put("/resume", isAuth, updateResume);



export default userRouter