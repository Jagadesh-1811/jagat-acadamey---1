import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    getRecentUsers,
    getRecentEnrollments,
    getActivityFeed,
    getCourseStats,
    getPendingEducators,
    getAllEducators,
    approveEducator,
    rejectEducator,
    deleteEducator
} from "../controllers/adminController.js";

const adminRouter = express.Router();

// Dashboard statistics
adminRouter.get("/stats", getDashboardStats);

// User management
adminRouter.get("/users", getAllUsers);
adminRouter.get("/users/recent", getRecentUsers);

// Enrollment data
adminRouter.get("/enrollments/recent", getRecentEnrollments);

// Activity feed
adminRouter.get("/activity", getActivityFeed);

// Course statistics
adminRouter.get("/courses/stats", getCourseStats);

// ==================== EDUCATOR APPROVAL MANAGEMENT ====================
adminRouter.get("/educators", getAllEducators);
adminRouter.get("/educators/pending", getPendingEducators);
adminRouter.post("/educators/:educatorId/approve", approveEducator);
adminRouter.post("/educators/:educatorId/reject", rejectEducator);
adminRouter.delete("/educators/:educatorId", deleteEducator);

export default adminRouter;
