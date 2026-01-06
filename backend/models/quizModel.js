import mongoose from 'mongoose';

const quizSchema = new mongoose.Schema({
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true,
    },
    educator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },
    quizLink: {
        type: String,
        required: true,
    },
    liveSessionLink: {
        type: String,
        required: true,
    },
    instructions: {
        type: String,
        required: true,
    },
    rewards: {
        type: String,
        required: true,
    },
    schedule: {
        type: Date,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
});

export default mongoose.model('Quiz', quizSchema);
