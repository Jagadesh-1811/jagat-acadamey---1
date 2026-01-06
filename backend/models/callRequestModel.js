import mongoose from "mongoose";

const callRequestSchema = new mongoose.Schema({
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
    status: {
        type: String,
        enum: ["pending", "accepted", "rejected", "expired"],
        default: "pending"
    },
    roomId: {
        type: String,
        default: null
    },
    message: {
        type: String,
        default: ""
    }
}, { timestamps: true });

const CallRequest = mongoose.model("CallRequest", callRequestSchema);

export default CallRequest;
