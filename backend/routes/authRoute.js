import express from "express"
import {googleSignup, login, logOut, resetPassword, sendOtp, signUp, verifyOtp, deleteAccount } from "../controllers/authController.js"
import isAuth from "../middlewares/isAuth.js"

const authRouter = express.Router()

authRouter.post("/signup",signUp)

authRouter.post("/login",login)
authRouter.get("/logout",logOut)
authRouter.post("/googlesignup",googleSignup)
authRouter.post("/sendotp",sendOtp)
authRouter.post("/verifyotp",verifyOtp)
authRouter.post("/resetpassword",resetPassword)

// Delete account endpoint - protected by isAuth middleware
authRouter.delete("/delete", isAuth, deleteAccount)


export default authRouter