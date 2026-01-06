import express from "express";
import {
    adminLogin,
    setupSuperAdmin,
    verifyAdmin,
    adminLogout
} from "../controllers/adminAuthController.js";

const adminAuthRouter = express.Router();

// POST /api/admin/setup - Create initial super admin (one-time)
adminAuthRouter.post("/setup", setupSuperAdmin);

// POST /api/admin/login - Admin login
adminAuthRouter.post("/login", adminLogin);

// GET /api/admin/verify - Verify admin token
adminAuthRouter.get("/verify", verifyAdmin);

// POST /api/admin/logout - Admin logout
adminAuthRouter.post("/logout", adminLogout);

export default adminAuthRouter;
