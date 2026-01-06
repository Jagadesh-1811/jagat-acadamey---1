import express from "express"
import dotenv from "dotenv"
import connectDb from "./configs/db.js"
import authRouter from "./routes/authRoute.js"
import cookieParser from "cookie-parser"
import cors from "cors"
import userRouter from "./routes/userRoute.js"
import courseRouter from "./routes/courseRoute.js"
import paymentRouter from "./routes/paymentRoute.js"
import aiRouter from "./routes/aiRoute.js"
import aiChatRouter from "./routes/aiChatRoute.js"
import reviewRouter from "./routes/reviewRoute.js"
import assignmentRouter from "./routes/assignmentRoute.js"
import submissionRouter from "./routes/submissionRoute.js"
import gradeRouter from "./routes/gradeRoute.js"
import materialRouter from "./routes/materialRoute.js"
import quizRouter from "./routes/quizRoute.js"
import doubtSessionRouter from "./routes/doubtSessionRoute.js"
import certificationRouter from "./routes/certificationRoute.js"
import feedbackRouter from "./routes/feedbackRoute.js"
import adminAuthRouter from "./routes/adminAuthRoute.js"
import adminRouter from "./routes/adminRoute.js"
import voiceRoomRouter from "./routes/voiceRoomRoute.js"
import progressRouter from "./routes/progressRoute.js"
import moduleRouter from "./routes/moduleRoute.js"
import chatRouter from "./routes/chatRoute.js"

dotenv.config()
let port = process.env.PORT
let app = express()
// CORS configuration
app.use(express.json())
app.use(cookieParser())
app.use(cors({
    origin: [
        "http://localhost:5173",
        "https://jagat-acadamey-1-1.onrender.com"
    ],
    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/ai-chat", aiChatRouter)

// Health check endpoint for debugging
app.get("/api/ai-chat/health", (req, res) => {
    res.status(200).json({ message: "AI Chat service is up" })
})

app.use("/api/review", reviewRouter)
app.use("/api/assignment", assignmentRouter)
app.use("/api/submission", submissionRouter)
app.use("/api/grade", gradeRouter)
app.use("/api/material", materialRouter)
app.use("/api/quiz", quizRouter)
app.use("/api/doubt-session", doubtSessionRouter)
app.use("/api/certification", certificationRouter)
app.use("/api/feedback", feedbackRouter)
app.use("/api/admin", adminAuthRouter)
app.use("/api/admin/data", adminRouter)
app.use("/api/voice-room", voiceRoomRouter)
app.use("/api/progress", progressRouter)
app.use("/api/module", moduleRouter)
app.use("/api/chat", chatRouter)




app.get("/", (req, res) => {
    res.send("Hello From Server")
})

connectDb().then(() => {
    app.listen(port, () => {
        console.log("Server Started on port", port);

        // Check ZegoCloud credentials
        const zegoAppId = process.env.ZEGO_APP_ID;
        const zegoSecret = process.env.ZEGO_SERVER_SECRET;

        console.log('========================================');
        console.log('ZegoCloud Configuration:');
        console.log('ZEGO_APP_ID loaded:', zegoAppId ? 'Yes' : 'No', '| Value:', zegoAppId || 'undefined');
        console.log('ZEGO_SERVER_SECRET loaded:', zegoSecret ? 'Yes (length: ' + zegoSecret.length + ')' : 'No');

        if (!zegoAppId || !zegoSecret) {
            console.log('⚠️  WARNING: ZegoCloud credentials not configured!');
            console.log('   Add ZEGO_APP_ID and ZEGO_SERVER_SECRET to backend/.env');
        } else {
            console.log('✅ ZegoCloud credentials configured correctly');
        }
        console.log('========================================');
    })
}).catch(err => {
    console.error("Failed to connect to DB:", err);
    process.exit(1);
});

