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

dotenv.config()
let port = process.env.PORT
let app = express()
app.use(express.json())
app.use(cookieParser())
app.use(cors({

    origin: "https://jagat-acadamey-1-1.onrender.com",

    credentials: true
}))
app.use("/api/auth", authRouter)
app.use("/api/user", userRouter)
app.use("/api/course", courseRouter)
app.use("/api/payment", paymentRouter)
app.use("/api/ai", aiRouter)
app.use("/api/ai", aiChatRouter)
app.use("/api/review", reviewRouter)
app.use("/api/assignment", assignmentRouter)
app.use("/api/submission", submissionRouter)
app.use("/api/grade", gradeRouter)
app.use("/api/material", materialRouter)
app.use("/api/quiz", quizRouter)
app.use("/api/doubt-session", doubtSessionRouter)
app.use("/api/certification", certificationRouter)



app.get("/" , (req,res)=>{
    res.send("Hello From Server")
})

app.listen(port , ()=>{
    console.log("Server Started ")
    connectDb()
})

