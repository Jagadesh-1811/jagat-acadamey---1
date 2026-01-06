import mongoose from "mongoose";

const doubtSessionSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    meetingLink: {
        type: String,
        required: true
    },

}, { timestamps: true });

const DoubtSession = mongoose.model("DoubtSession", doubtSessionSchema);

export default DoubtSession;