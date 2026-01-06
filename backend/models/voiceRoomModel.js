import mongoose from "mongoose";

const voiceRoomSchema = new mongoose.Schema({
    roomId: {
        type: String,
        required: true,
        unique: true
    },
    title: {
        type: String,
        default: "Voice Room"
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    participants: [{
        user: {
            type: mongoose.Schema.Types.ObjectId,
            ref: "User"
        },
        joinedAt: {
            type: Date,
            default: Date.now
        }
    }],
    createdBy: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    status: {
        type: String,
        enum: ["pending", "active", "completed", "cancelled"],
        default: "pending"
    },
    startTime: {
        type: Date
    },
    endTime: {
        type: Date
    },
    duration: {
        type: Number,
        default: 0
    },
    scheduledDay: {
        type: Number,
        min: 0,
        max: 6
    }
}, { timestamps: true });

const VoiceRoom = mongoose.model("VoiceRoom", voiceRoomSchema);

export default VoiceRoom;

