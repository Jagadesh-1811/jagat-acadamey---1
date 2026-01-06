import mongoose from "mongoose";

// Conversation Schema - represents a chat between student and educator
const conversationSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    lastMessage: {
        type: String,
        default: ""
    },
    lastMessageAt: {
        type: Date,
        default: Date.now
    },
    unreadStudent: {
        type: Number,
        default: 0
    },
    unreadEducator: {
        type: Number,
        default: 0
    },
    // Email notification flags
    educatorNotifiedFirstMessage: {
        type: Boolean,
        default: false
    },
    studentNotifiedFirstReply: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient queries
conversationSchema.index({ student: 1, educator: 1, course: 1 }, { unique: true });

// Message Schema - individual messages in a conversation
const messageSchema = new mongoose.Schema({
    conversation: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Conversation",
        required: true
    },
    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    senderRole: {
        type: String,
        enum: ["student", "educator"],
        required: true
    },
    message: {
        type: String,
        required: true
    },
    isRead: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Index for efficient message retrieval
messageSchema.index({ conversation: 1, createdAt: -1 });

const Conversation = mongoose.model("Conversation", conversationSchema);
const Message = mongoose.model("Message", messageSchema);

export { Conversation, Message };
