
import express from "express";
import { uploadMaterial, getMaterials, deleteMaterial } from "../controllers/materialController.js";
import isAuth from "../middlewares/isAuth.js";

const router = express.Router();

router.post("/course/:courseId/materials", isAuth, uploadMaterial);
router.get("/course/:courseId/materials", isAuth, getMaterials);
router.delete("/materials/:materialId", isAuth, deleteMaterial);

export default router;
