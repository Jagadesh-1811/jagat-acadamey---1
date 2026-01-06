import mongoose from 'mongoose';

const progressSchema = new mongoose.Schema({
    student: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true
    },
    course: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Course',
        required: true
    },
    completedLectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    }],
    lastAccessedLecture: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Lecture'
    },
    progressPercentage: {
        type: Number,
        default: 0
    },
    lastAccessed: {
        type: Date,
        default: Date.now
    }
}, {
    timestamps: true
});

// Compound index to ensure one progress record per student per course
progressSchema.index({ student: 1, course: 1 }, { unique: true });

export default mongoose.model('Progress', progressSchema);
