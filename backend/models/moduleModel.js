import mongoose from "mongoose";

const moduleSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    description: {
        type: String
    },
    order: {
        type: Number,
        default: 0
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course"
    },
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }]
}, { timestamps: true });

const Module = mongoose.model("Module", moduleSchema);

export default Module;
