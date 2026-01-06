import { Conversation, Message } from "../models/chatModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

// Get or create conversation
export const getOrCreateConversation = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.userId;

        // Get course with educator info
        const course = await Course.findById(courseId).populate("creator", "name email");
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        const educatorId = course.creator._id;

        // Check if student is enrolled
        if (!course.enrolledStudents.includes(studentId)) {
            return res.status(403).json({ message: "You must be enrolled to chat with educator" });
        }

        // Find or create conversation
        let conversation = await Conversation.findOne({
            student: studentId,
            educator: educatorId,
            course: courseId
        }).populate("student", "name email photoUrl")
            .populate("educator", "name email photoUrl")
            .populate("course", "title");

        if (!conversation) {
            conversation = await Conversation.create({
                student: studentId,
                educator: educatorId,
                course: courseId
            });
            conversation = await Conversation.findById(conversation._id)
                .populate("student", "name email photoUrl")
                .populate("educator", "name email photoUrl")
                .populate("course", "title");
        }

        res.status(200).json({ conversation });

    } catch (error) {
        console.error("Get/Create conversation error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Send message
export const sendMessage = async (req, res) => {
    try {
        const { conversationId, message } = req.body;
        const senderId = req.userId;

        if (!message || !message.trim()) {
            return res.status(400).json({ message: "Message cannot be empty" });
        }

        const conversation = await Conversation.findById(conversationId)
            .populate("student", "name email")
            .populate("educator", "name email")
            .populate("course", "title");

        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Determine sender role
        const senderIdStr = senderId.toString();
        const isStudent = conversation.student._id.toString() === senderIdStr;
        const isEducator = conversation.educator._id.toString() === senderIdStr;

        if (!isStudent && !isEducator) {
            return res.status(403).json({ message: "Not authorized to send messages in this conversation" });
        }

        const senderRole = isStudent ? "student" : "educator";

        // Create message
        const newMessage = await Message.create({
            conversation: conversationId,
            sender: senderId,
            senderRole,
            message: message.trim()
        });

        // Update conversation
        conversation.lastMessage = message.trim().slice(0, 100);
        conversation.lastMessageAt = new Date();

        if (isStudent) {
            conversation.unreadEducator += 1;
        } else {
            conversation.unreadStudent += 1;
        }

        await conversation.save();

        const populatedMessage = await Message.findById(newMessage._id)
            .populate("sender", "name photoUrl");

        res.status(201).json({ message: populatedMessage });

    } catch (error) {
        console.error("Send message error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get messages
export const getMessages = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;
        const { limit = 50, before } = req.query;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        // Check authorization
        const userIdStr = userId.toString();
        const isStudent = conversation.student.toString() === userIdStr;
        const isEducator = conversation.educator.toString() === userIdStr;

        if (!isStudent && !isEducator) {
            return res.status(403).json({ message: "Not authorized" });
        }

        // Build query
        let query = { conversation: conversationId };
        if (before) {
            query.createdAt = { $lt: new Date(before) };
        }

        const messages = await Message.find(query)
            .sort({ createdAt: -1 })
            .limit(parseInt(limit))
            .populate("sender", "name photoUrl");

        // Mark messages as read
        if (isStudent) {
            await Message.updateMany(
                { conversation: conversationId, senderRole: "educator", isRead: false },
                { isRead: true }
            );
            await Conversation.findByIdAndUpdate(conversationId, { unreadStudent: 0 });
        } else {
            await Message.updateMany(
                { conversation: conversationId, senderRole: "student", isRead: false },
                { isRead: true }
            );
            await Conversation.findByIdAndUpdate(conversationId, { unreadEducator: 0 });
        }

        res.status(200).json({ messages: messages.reverse() });

    } catch (error) {
        console.error("Get messages error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Get all conversations for a user
export const getConversations = async (req, res) => {
    try {
        const userId = req.userId;

        const conversations = await Conversation.find({
            $or: [{ student: userId }, { educator: userId }]
        })
            .populate("student", "name email photoUrl")
            .populate("educator", "name email photoUrl")
            .populate("course", "title thumbnail")
            .sort({ lastMessageAt: -1 });

        // Add unread count for current user
        const conversationsWithUnread = conversations.map(conv => {
            const isStudent = conv.student._id.toString() === userId;
            return {
                ...conv.toObject(),
                unreadCount: isStudent ? conv.unreadStudent : conv.unreadEducator,
                otherUser: isStudent ? conv.educator : conv.student
            };
        });

        res.status(200).json({ conversations: conversationsWithUnread });

    } catch (error) {
        console.error("Get conversations error:", error);
        res.status(500).json({ message: error.message });
    }
};

// Mark conversation as read
export const markAsRead = async (req, res) => {
    try {
        const { conversationId } = req.params;
        const userId = req.userId;

        const conversation = await Conversation.findById(conversationId);
        if (!conversation) {
            return res.status(404).json({ message: "Conversation not found" });
        }

        const isStudent = conversation.student.toString() === userId;

        if (isStudent) {
            conversation.unreadStudent = 0;
        } else {
            conversation.unreadEducator = 0;
        }

        await conversation.save();

        res.status(200).json({ message: "Marked as read" });

    } catch (error) {
        console.error("Mark as read error:", error);
        res.status(500).json({ message: error.message });
    }
};
