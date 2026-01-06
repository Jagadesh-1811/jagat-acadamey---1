import express from "express"
import { googleSignup, login, logOut, signUp, deleteAccount, emailLinkSignup, supabaseSync, supabaseLogin, signupWithVerification, verifyEmail, getEducatorStatus } from "../controllers/authController.js"
import { syncFirebaseUser } from "../controllers/firebaseAuthController.js"
import isAuth from "../middlewares/isAuth.js"

const authRouter = express.Router()

authRouter.post("/signup", signUp)
authRouter.post("/signup-verify", signupWithVerification)  // Signup with email verification
authRouter.get("/verify-email/:token", verifyEmail)        // Verify email from link

authRouter.post("/login", login)
authRouter.get("/logout", logOut)
authRouter.post("/googlesignup", googleSignup)
authRouter.post("/email-link-signup", emailLinkSignup)

// Firebase authentication routes
authRouter.post("/firebase-sync", isAuth, syncFirebaseUser)

// Educator status check (no auth required)
authRouter.get("/educator-status", getEducatorStatus)

// Supabase authentication routes
authRouter.post("/supabase-sync", supabaseSync)
authRouter.post("/supabase-login", supabaseLogin)

// Delete account endpoint - protected by isAuth middleware
authRouter.delete("/delete", isAuth, deleteAccount)


export default authRouter
