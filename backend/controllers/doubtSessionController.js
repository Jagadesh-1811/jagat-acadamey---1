import DoubtSession from '../models/doubtSessionModel.js';
import Course from '../models/courseModel.js';

export const createDoubtSession = async (req, res) => {
    try {
        const { courseId, meetingLink } = req.body;
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }
        if (course.creator.toString() !== req.userId) {
            return res.status(403).json({ message: 'You are not authorized to create a doubt session for this course' });
        }
        const newDoubtSession = new DoubtSession({
            course: courseId,
            meetingLink
        });
        await newDoubtSession.save();
        course.doubtSessions.push(newDoubtSession._id);
        await course.save();
        res.status(201).json(newDoubtSession);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getDoubtSessionByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const doubtSessions = await DoubtSession.find({ course: courseId });
        res.status(200).json(doubtSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

// Get all doubt sessions for admin dashboard
export const getAllDoubtSessions = async (req, res) => {
    try {
        const doubtSessions = await DoubtSession.find()
            .populate({
                path: 'course',
                select: 'title creator',
                populate: {
                    path: 'creator',
                    select: 'name email'
                }
            })
            .sort({ createdAt: -1 })
            .limit(20);
        res.status(200).json(doubtSessions);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};