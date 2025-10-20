import express from "express";
import { getCertificationLink, createOrUpdateCertificationLink } from "../controllers/certificationController.js";
import isAuth from "../middlewares/isAuth.js";
import isAdmin from "../middlewares/isAdmin.js";

const certificationRouter = express.Router();

certificationRouter.get("/link", getCertificationLink);
certificationRouter.post("/manage", isAuth, isAdmin, createOrUpdateCertificationLink);

export default certificationRouter;
