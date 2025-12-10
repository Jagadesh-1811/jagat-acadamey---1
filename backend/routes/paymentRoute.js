import express from "express"
import { createOrder, verifyPayment } from "../controllers/orderController.js";
import isAuth from "../middlewares/isAuth.js";


let paymentRouter = express.Router()

paymentRouter.post("/create-order", isAuth, createOrder);
paymentRouter.post("/verify-payment", isAuth, verifyPayment);


export default paymentRouter