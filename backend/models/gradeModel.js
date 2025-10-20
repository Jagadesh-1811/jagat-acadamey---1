import mongoose from "mongoose";

const gradeSchema = new mongoose.Schema({
    submission: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Submission',
        required: true,
        unique: true // A submission can only have one grade
    },
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    grade: { type: String, required: true },
    feedback: { type: String, default: '' }
}, { timestamps: true });

const Grade = mongoose.model("Grade", gradeSchema);
export default Grade;
