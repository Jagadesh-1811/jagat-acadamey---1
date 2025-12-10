import mongoose from "mongoose";

const feedbackSchema = new mongoose.Schema(
    {
        type: {
            type: String,
            enum: ["feedback", "issue"],
            required: true
        },
        name: {
            type: String,
            required: true,
            trim: true
        },
        email: {
            type: String,
            required: true,
            trim: true
        },
        subject: {
            type: String,
            required: true,
            trim: true
        },
        message: {
            type: String,
            required: true,
            trim: true
        },
        status: {
            type: String,
            enum: ["pending", "reviewed", "resolved"],
            default: "pending"
        }
    },
    { timestamps: true }
);

const Feedback = mongoose.model("Feedback", feedbackSchema);
export default Feedback;
