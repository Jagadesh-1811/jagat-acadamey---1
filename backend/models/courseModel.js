import mongoose from "mongoose"

const courseSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true
    },
    subTitle: {
        type: String
    },
    description: {
        type: String
    },
    category: {
        type: String,
        required: true
    },
    level: {
        type: String,
        enum: ['Beginner', 'Intermediate', 'Advanced']
    },
    price: {
        type: Number
    },
    thumbnail: {
        type: String
    },
    enrolledStudents: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    }],
    lectures: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Lecture"
    }],
    modules: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Module"
    }],
    materials: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Material"
    }],
    creator: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
    },
    isPublished: {
        type: Boolean,
        default: false
    },
    reviews: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Review'
    }],
    assignments: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Assignment"
    }],
    quizzes: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "Quiz"
    }],
    doubtSessions: [{
        type: mongoose.Schema.Types.ObjectId,
        ref: "DoubtSession"
    }],
}, { timestamps: true })

const Course = mongoose.model("Course", courseSchema)

export default Course