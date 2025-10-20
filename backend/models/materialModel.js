
import mongoose from "mongoose";

const materialSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    fileType: {
        type: String,
        required: true
    },
    fileSize: {
        type: Number,
        required: true
    },
    url: {
        type: String,
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Course",
        required: true
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true
    }
}, { timestamps: true });

const Material = mongoose.model("Material", materialSchema);

export default Material;
