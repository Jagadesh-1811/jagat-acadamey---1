import mongoose from "mongoose";

const assignmentSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
    },
    referenceLink: {
        type: String,
    },
    deadline: {
        type: Date,
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    }
}, { timestamps: true });

export const Assignment = mongoose.model("Assignment", assignmentSchema);