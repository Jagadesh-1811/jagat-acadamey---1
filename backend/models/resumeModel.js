import mongoose from "mongoose";

const resumeSchema = new mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
        unique: true
    },
    fullName: { type: String, default: '' },
    title: { type: String, default: '' },
    email: { type: String, default: '' },
    phone: { type: String, default: '' },
    linkedin: { type: String, default: '' },
    summary: { type: String, default: '' },
    education: [{
        institution: { type: String, default: '' },
        degree: { type: String, default: '' },
        duration: { type: String, default: '' },
        details: { type: String, default: '' }
    }],
    experience: [{
        company: { type: String, default: '' },
        position: { type: String, default: '' },
        duration: { type: String, default: '' },
        description: { type: String, default: '' }
    }],
    skills: [{ type: String }]
}, { timestamps: true });

const Resume = mongoose.model("Resume", resumeSchema);
export default Resume;
