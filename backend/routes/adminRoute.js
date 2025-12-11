import express from "express";
import {
    getDashboardStats,
    getAllUsers,
    getRecentUsers,
    getRecentEnrollments,
    getActivityFeed,
    getCourseStats
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

export default adminRouter;
