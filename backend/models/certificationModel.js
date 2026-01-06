import mongoose from "mongoose";

const certificationSchema = new mongoose.Schema({
    link: {
        type: String,
        required: true,
    },
}, { timestamps: true });

const Certification = mongoose.model("Certification", certificationSchema);

export default Certification;