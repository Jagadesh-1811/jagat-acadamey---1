import mongoose from "mongoose";

const lectureSchema = new mongoose.Schema({
    lectureTitle: {
        type: String,
        required: true
    },
    videoUrl: {
        type: String
    },
    isPreviewFree: {
        type: Boolean
    },
    module: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    },
    order: {
        type: Number,
        default: 0
    },
    duration: {
        type: String
    }

}, { timestamps: true })


const Lecture = mongoose.model("Lecture", lectureSchema)

export default Lecture