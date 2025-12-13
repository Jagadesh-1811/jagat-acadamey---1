import express from "express";
import isAuth from "../middlewares/isAuth.js";
import isAdminAuth from "../middlewares/isAdminAuth.js";
import {
    generateToken,
    createCallRequest,
    getCallRequests,
    respondToRequest,
    getActiveRooms,
    getLiveRooms,
    endRoom,
    getMyCallHistory,
    getMyPendingRequests,
    getWeekendStatus,
    joinRoom,
    getEducatorLiveRooms,
    startRoom,
    adminEndRoom
} from "../controllers/voiceRoomController.js";

const voiceRoomRouter = express.Router();

// Public route - check if voice calls are available (weekend check)
voiceRoomRouter.get("/weekend-status", getWeekendStatus);

// Admin routes - use isAdminAuth (defined BEFORE isAuth middleware)
voiceRoomRouter.get("/admin/active", isAdminAuth, getActiveRooms);
voiceRoomRouter.put("/admin/:roomId/end", isAdminAuth, adminEndRoom);

// All routes below require user authentication
voiceRoomRouter.use(isAuth);

// Token generation
voiceRoomRouter.post("/token", generateToken);

// Student routes
voiceRoomRouter.post("/request", createCallRequest);
voiceRoomRouter.get("/my-requests", getMyPendingRequests);
voiceRoomRouter.post("/join/:roomId", joinRoom);

// Educator routes  
voiceRoomRouter.get("/requests", getCallRequests);
voiceRoomRouter.put("/request/:requestId", respondToRequest);
voiceRoomRouter.get("/educator/:educatorId/live", getEducatorLiveRooms);
voiceRoomRouter.post("/start", startRoom);

// Shared routes
voiceRoomRouter.get("/live", getLiveRooms);
voiceRoomRouter.put("/:roomId/end", endRoom);
voiceRoomRouter.get("/history", getMyCallHistory);

// Legacy admin route (also user authenticated for backwards compat)
voiceRoomRouter.get("/active", getActiveRooms);

export default voiceRoomRouter;
