import crypto from 'crypto';
import VoiceRoom from '../models/voiceRoomModel.js';
import CallRequest from '../models/callRequestModel.js';
import User from '../models/userModel.js';
import Course from '../models/courseModel.js';

// ZegoCloud Token Generation (Token04 format)
const generateZegoToken = (appId, userId, serverSecret, effectiveTimeInSeconds, payload = '') => {
    const currentTime = Math.floor(Date.now() / 1000);
    const expireTime = currentTime + effectiveTimeInSeconds;

    const nonce = crypto.randomBytes(8).readBigUInt64BE().toString();

    // Create payload info
    const payloadInfo = {
        app_id: appId,
        user_id: userId,
        nonce: parseInt(nonce),
        ctime: currentTime,
        expire: expireTime,
        payload: payload
    };

    const payloadString = JSON.stringify(payloadInfo);

    // Encrypt payload with AES-CBC
    const iv = crypto.randomBytes(16);
    const key = Buffer.alloc(16);
    Buffer.from(serverSecret.slice(0, 32), 'hex').copy(key);

    const cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    let encrypted = cipher.update(payloadString, 'utf8');
    encrypted = Buffer.concat([encrypted, cipher.final()]);

    // Combine IV and encrypted data
    const tokenData = Buffer.concat([iv, encrypted]);

    // Base64 encode and add version prefix
    const token = '04' + Buffer.from(tokenData).toString('base64');

    return token;
};

// Check if current day is weekend (Saturday = 6, Sunday = 0)
const isWeekend = () => {
    const day = new Date().getDay();
    return day === 0 || day === 6;
};

// Middleware to check weekend access
export const checkWeekendAccess = (req, res, next) => {
    if (!isWeekend()) {
        return res.status(403).json({
            success: false,
            message: "Voice rooms are only available on weekends (Saturday & Sunday)",
            isWeekend: false
        });
    }
    next();
};

// Generate token for voice room
export const generateToken = async (req, res) => {
    try {
        const { roomId } = req.body;
        const userId = req.userId;

        if (!roomId) {
            return res.status(400).json({ success: false, message: "Room ID is required" });
        }

        const user = await User.findById(userId);
        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        const appId = parseInt(process.env.ZEGO_APP_ID);
        const serverSecret = process.env.ZEGO_SERVER_SECRET;

        console.log('ZEGO_APP_ID loaded:', appId ? 'Yes' : 'No', '| Value:', appId || 'undefined');
        console.log('ZEGO_SERVER_SECRET loaded:', serverSecret ? 'Yes (length: ' + serverSecret.length + ')' : 'No');

        if (!appId || !serverSecret) {
            console.error('ZegoCloud credentials missing! Check backend/.env file');
            return res.status(500).json({ success: false, message: "ZegoCloud credentials not configured" });
        }

        // Generate token valid for 1 hour
        const token = generateZegoToken(appId, String(userId), serverSecret, 3600, '');

        res.status(200).json({
            success: true,
            token,
            appId,
            userId: String(userId),
            userName: user.name,
            roomId
        });
    } catch (error) {
        console.error("Generate token error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Create call request (Student requests to talk to educator)
export const createCallRequest = async (req, res) => {
    try {
        const { educatorId, message } = req.body;
        const studentId = req.userId;

        // Check if it's weekend
        if (!isWeekend()) {
            return res.status(403).json({
                success: false,
                message: "Voice calls are only available on weekends (Saturday & Sunday)"
            });
        }

        // Verify student role
        const student = await User.findById(studentId);
        if (!student || student.role !== 'student') {
            return res.status(403).json({ success: false, message: "Only students can request voice calls" });
        }

        // Verify educator exists and is an educator
        const educator = await User.findById(educatorId);
        if (!educator || educator.role !== 'educator') {
            return res.status(404).json({ success: false, message: "Educator not found" });
        }

        // Check if there's already a pending request from this student to this educator
        const existingRequest = await CallRequest.findOne({
            student: studentId,
            educator: educatorId,
            status: 'pending'
        });

        if (existingRequest) {
            return res.status(400).json({
                success: false,
                message: "You already have a pending request with this educator"
            });
        }

        // Check if educator is currently in an active call
        const activeRoom = await VoiceRoom.findOne({
            educator: educatorId,
            status: 'active'
        });

        if (activeRoom) {
            return res.status(400).json({
                success: false,
                message: "Educator is currently in another call. Please try again later."
            });
        }

        // Create call request
        const callRequest = new CallRequest({
            student: studentId,
            educator: educatorId,
            message: message || '',
            status: 'pending'
        });

        await callRequest.save();

        res.status(201).json({
            success: true,
            message: "Call request sent successfully",
            callRequest
        });
    } catch (error) {
        console.error("Create call request error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get pending call requests (For educators)
export const getCallRequests = async (req, res) => {
    try {
        const educatorId = req.userId;

        const requests = await CallRequest.find({
            educator: educatorId,
            status: 'pending'
        }).populate('student', 'name email photoUrl').sort({ createdAt: -1 });

        res.status(200).json({
            success: true,
            requests
        });
    } catch (error) {
        console.error("Get call requests error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Start a voice room directly (For educators) - without needing a student request
export const startRoom = async (req, res) => {
    try {
        const educatorId = req.userId;
        const { title } = req.body;

        // Check if it's weekend
        if (!isWeekend()) {
            return res.status(403).json({
                success: false,
                message: "Voice calls are only available on weekends (Saturday & Sunday)"
            });
        }

        // Verify educator role
        const educator = await User.findById(educatorId);
        if (!educator || educator.role !== 'educator') {
            return res.status(403).json({ success: false, message: "Only educators can start voice rooms" });
        }

        // Check if educator already has an active room
        const existingRoom = await VoiceRoom.findOne({
            educator: educatorId,
            status: 'active'
        });

        if (existingRoom) {
            return res.status(200).json({
                success: true,
                message: "You already have an active room",
                roomId: existingRoom.roomId,
                voiceRoom: existingRoom
            });
        }

        // Create new room
        const roomId = `voice_${educatorId}_${Date.now()}`;
        console.log('Educator starting room directly:', roomId);

        const voiceRoom = new VoiceRoom({
            roomId,
            title: title || `Live Session with ${educator.name}`,
            educator: educatorId,
            createdBy: educatorId,
            participants: [],
            status: 'active',
            startTime: new Date(),
            scheduledDay: new Date().getDay()
        });

        await voiceRoom.save();
        console.log('Room created successfully:', voiceRoom._id);

        // Accept all pending requests for this educator
        await CallRequest.updateMany(
            {
                educator: educatorId,
                status: 'pending'
            },
            {
                status: 'accepted',
                roomId: roomId
            }
        );

        res.status(201).json({
            success: true,
            message: "Voice room started successfully!",
            roomId,
            voiceRoom
        });
    } catch (error) {
        console.error("Start room error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Respond to call request (Accept/Reject)
export const respondToRequest = async (req, res) => {
    try {
        const { requestId } = req.params;
        const { action } = req.body; // 'accept' or 'reject'
        const educatorId = req.userId;

        const callRequest = await CallRequest.findById(requestId).populate('student', 'name');

        if (!callRequest) {
            return res.status(404).json({ success: false, message: "Call request not found" });
        }

        if (callRequest.educator.toString() !== educatorId) {
            return res.status(403).json({ success: false, message: "You can only respond to your own call requests" });
        }

        if (callRequest.status !== 'pending') {
            return res.status(400).json({ success: false, message: "This request has already been processed" });
        }

        if (action === 'accept') {
            // Create a voice room - educator starts it, students will join
            const roomId = `voice_${educatorId}_${Date.now()}`;
            console.log('Creating voice room with ID:', roomId);

            const voiceRoom = new VoiceRoom({
                roomId,
                title: `Doubt Session with ${callRequest.student?.name || 'Student'}`,
                educator: educatorId,
                createdBy: callRequest.student,
                participants: [], // Students will join later
                status: 'active',
                startTime: new Date(),
                scheduledDay: new Date().getDay()
            });

            await voiceRoom.save();
            console.log('Voice room saved successfully:', voiceRoom._id);

            callRequest.status = 'accepted';
            callRequest.roomId = roomId;
            await callRequest.save();
            console.log('Call request updated with roomId');

            // Also accept all other pending requests from same educator
            // so multiple students can join the same room
            await CallRequest.updateMany(
                {
                    educator: educatorId,
                    status: 'pending',
                    _id: { $ne: requestId }
                },
                {
                    status: 'accepted',
                    roomId: roomId
                }
            );

            console.log('Sending success response with roomId:', roomId);
            res.status(200).json({
                success: true,
                message: "Call request accepted. Room is now live!",
                roomId,
                voiceRoom
            });
        } else if (action === 'reject') {
            callRequest.status = 'rejected';
            await callRequest.save();

            res.status(200).json({
                success: true,
                message: "Call request rejected"
            });
        } else {
            return res.status(400).json({ success: false, message: "Invalid action. Use 'accept' or 'reject'" });
        }
    } catch (error) {
        console.error("Respond to request error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};


// Get all active voice rooms (For admin)
export const getActiveRooms = async (req, res) => {
    try {
        const activeRooms = await VoiceRoom.find({ status: 'active' })
            .populate('participants.user', 'name email photoUrl')
            .populate('educator', 'name email photoUrl')
            .populate('createdBy', 'name email photoUrl')
            .sort({ startTime: -1 });

        // Calculate duration for each room
        const roomsWithDuration = activeRooms.map(room => {
            const duration = Math.floor((Date.now() - room.startTime) / 1000);
            return {
                ...room.toObject(),
                currentDuration: duration,
                participantCount: room.participants.length
            };
        });

        res.status(200).json({
            success: true,
            rooms: roomsWithDuration,
            count: roomsWithDuration.length
        });
    } catch (error) {
        console.error("Get active rooms error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get live rooms (For students to see joinable rooms and which educators are busy)
export const getLiveRooms = async (req, res) => {
    try {
        // First, clean up stale rooms (active for more than 2 hours)
        const twoHoursAgo = new Date(Date.now() - 2 * 60 * 60 * 1000);
        await VoiceRoom.updateMany(
            {
                status: 'active',
                startTime: { $lt: twoHoursAgo }
            },
            {
                status: 'completed',
                endTime: new Date()
            }
        );

        // Get active rooms that are not stale
        const liveRooms = await VoiceRoom.find({
            status: 'active',
            startTime: { $gte: twoHoursAgo } // Only rooms started within last 2 hours
        })
            .populate('educator', 'name email photoUrl')
            .populate('participants.user', 'name photoUrl')
            .populate('createdBy', 'name');

        // Return list of educator IDs who are currently in calls
        const busyEducatorIds = liveRooms.map(room => room.educator?._id?.toString()).filter(Boolean);

        res.status(200).json({
            success: true,
            busyEducators: busyEducatorIds,
            liveRooms: liveRooms.map(room => ({
                roomId: room.roomId,
                title: room.title,
                educatorId: room.educator?._id,
                educatorName: room.educator?.name,
                educatorPhoto: room.educator?.photoUrl,
                startTime: room.startTime,
                participantCount: room.participants?.length || 0,
                participants: (room.participants || []).map(p => ({
                    name: p.user?.name,
                    photoUrl: p.user?.photoUrl
                }))
            }))
        });
    } catch (error) {
        console.error("Get live rooms error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// End a voice room
export const endRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        const voiceRoom = await VoiceRoom.findOne({ roomId });

        if (!voiceRoom) {
            return res.status(404).json({ success: false, message: "Voice room not found" });
        }

        // Only educator, participants, or admin can end the room
        const isEducator = voiceRoom.educator.toString() === userId;
        const isParticipant = voiceRoom.participants.some(p => p.user.toString() === userId);

        const user = await User.findById(userId);
        const isAdmin = user?.role === 'admin';

        if (!isEducator && !isParticipant && !isAdmin) {
            return res.status(403).json({ success: false, message: "You are not authorized to end this room" });
        }

        voiceRoom.status = 'completed';
        voiceRoom.endTime = new Date();
        voiceRoom.duration = Math.floor((voiceRoom.endTime - voiceRoom.startTime) / 1000);

        await voiceRoom.save();

        res.status(200).json({
            success: true,
            message: "Voice room ended",
            duration: voiceRoom.duration
        });
    } catch (error) {
        console.error("End room error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Admin end room - no user auth required, uses admin auth
export const adminEndRoom = async (req, res) => {
    try {
        const { roomId } = req.params;

        const voiceRoom = await VoiceRoom.findOne({ roomId });

        if (!voiceRoom) {
            return res.status(404).json({ success: false, message: "Voice room not found" });
        }

        voiceRoom.status = 'completed';
        voiceRoom.endTime = new Date();
        voiceRoom.duration = Math.floor((voiceRoom.endTime - voiceRoom.startTime) / 1000);

        await voiceRoom.save();

        console.log(`Admin ended room: ${roomId}`);

        res.status(200).json({
            success: true,
            message: "Voice room ended by admin",
            duration: voiceRoom.duration
        });
    } catch (error) {
        console.error("Admin end room error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get call history for a user
export const getMyCallHistory = async (req, res) => {
    try {
        const userId = req.userId;

        const history = await VoiceRoom.find({
            $or: [
                { 'participants.user': userId },
                { educator: userId },
                { createdBy: userId }
            ],
            status: { $in: ['completed', 'cancelled'] }
        })
            .populate('participants.user', 'name email photoUrl')
            .populate('educator', 'name email photoUrl')
            .populate('createdBy', 'name email photoUrl')
            .sort({ endTime: -1 })
            .limit(50);

        res.status(200).json({
            success: true,
            history
        });
    } catch (error) {
        console.error("Get call history error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get my pending request status (For students)
export const getMyPendingRequests = async (req, res) => {
    try {
        const studentId = req.userId;

        // Only get requests from the last 24 hours to avoid stale data
        const twentyFourHoursAgo = new Date(Date.now() - 24 * 60 * 60 * 1000);

        const pendingRequests = await CallRequest.find({
            student: studentId,
            status: { $in: ['pending', 'accepted'] },
            createdAt: { $gte: twentyFourHoursAgo }
        }).populate('educator', 'name email photoUrl');

        // For accepted requests, verify the room is still active
        const validRequests = [];
        for (const request of pendingRequests) {
            if (request.status === 'accepted' && request.roomId) {
                // Check if room is still active
                const room = await VoiceRoom.findOne({
                    roomId: request.roomId,
                    status: 'active'
                });
                if (room) {
                    validRequests.push(request);
                }
                // If room is not active, don't include this request
            } else {
                // Pending requests are always included
                validRequests.push(request);
            }
        }

        res.status(200).json({
            success: true,
            requests: validRequests
        });
    } catch (error) {
        console.error("Get my pending requests error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Check weekend status
export const getWeekendStatus = async (req, res) => {
    try {
        const weekend = isWeekend();
        const currentDay = new Date().getDay();
        const dayNames = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];

        res.status(200).json({
            success: true,
            isWeekend: weekend,
            currentDay: dayNames[currentDay],
            message: weekend
                ? "Voice rooms are available today!"
                : "Voice rooms are only available on weekends (Saturday & Sunday)"
        });
    } catch (error) {
        res.status(500).json({ success: false, message: error.message });
    }
};

// Join an active voice room (For students)
export const joinRoom = async (req, res) => {
    try {
        const { roomId } = req.params;
        const userId = req.userId;

        // Check if it's weekend
        if (!isWeekend()) {
            return res.status(403).json({
                success: false,
                message: "Voice rooms are only available on weekends (Saturday & Sunday)"
            });
        }

        const voiceRoom = await VoiceRoom.findOne({ roomId, status: 'active' });

        if (!voiceRoom) {
            return res.status(404).json({ success: false, message: "Voice room not found or not active" });
        }

        // Check if user is already a participant
        const alreadyJoined = voiceRoom.participants.some(
            p => p.user.toString() === userId
        );

        if (!alreadyJoined) {
            // Add user to participants
            voiceRoom.participants.push({
                user: userId,
                joinedAt: new Date()
            });
            await voiceRoom.save();
        }

        res.status(200).json({
            success: true,
            message: alreadyJoined ? "Already in room" : "Joined room successfully",
            roomId: voiceRoom.roomId,
            voiceRoom
        });
    } catch (error) {
        console.error("Join room error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};

// Get live rooms for a specific educator (For students on ViewCourse page)
export const getEducatorLiveRooms = async (req, res) => {
    try {
        const { educatorId } = req.params;

        const liveRoom = await VoiceRoom.findOne({
            educator: educatorId,
            status: 'active'
        })
            .populate('educator', 'name photoUrl')
            .populate('participants.user', 'name photoUrl');

        if (!liveRoom) {
            return res.status(200).json({
                success: true,
                hasLiveRoom: false,
                room: null
            });
        }

        res.status(200).json({
            success: true,
            hasLiveRoom: true,
            room: {
                roomId: liveRoom.roomId,
                title: liveRoom.title,
                educatorName: liveRoom.educator.name,
                startTime: liveRoom.startTime,
                participantCount: liveRoom.participants.length,
                participants: liveRoom.participants.map(p => ({
                    name: p.user?.name,
                    photoUrl: p.user?.photoUrl
                }))
            }
        });
    } catch (error) {
        console.error("Get educator live rooms error:", error);
        res.status(500).json({ success: false, message: error.message });
    }
};
