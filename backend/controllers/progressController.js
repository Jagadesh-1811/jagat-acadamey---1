import Progress from '../models/progressModel.js';
import Course from '../models/courseModel.js';

// Get progress for a specific course
export const getCourseProgress = async (req, res) => {
    try {
        const { courseId } = req.params;
        const studentId = req.userId;

        let progress = await Progress.findOne({
            student: studentId,
            course: courseId
        }).populate('completedLectures');

        if (!progress) {
            // Create new progress record if none exists
            progress = await Progress.create({
                student: studentId,
                course: courseId,
                completedLectures: [],
                progressPercentage: 0
            });
        }

        res.status(200).json({
            success: true,
            completedLectures: progress.completedLectures.map(l => l._id),
            progressPercentage: progress.progressPercentage,
            lastAccessedLecture: progress.lastAccessedLecture
        });
    } catch (error) {
        console.error('Error fetching course progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch progress',
            error: error.message
        });
    }
};

// Mark a lecture as completed
export const markLectureCompleted = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const studentId = req.userId;

        // Find or create progress record
        let progress = await Progress.findOne({
            student: studentId,
            course: courseId
        });

        if (!progress) {
            progress = await Progress.create({
                student: studentId,
                course: courseId,
                completedLectures: [],
                progressPercentage: 0
            });
        }

        // Add lecture to completed if not already there
        if (!progress.completedLectures.includes(lectureId)) {
            progress.completedLectures.push(lectureId);
            progress.lastAccessedLecture = lectureId;
            progress.lastAccessed = Date.now();

            // Calculate progress percentage
            const course = await Course.findById(courseId);
            if (course && course.lectures) {
                const totalLectures = course.lectures.length;
                const completedCount = progress.completedLectures.length;
                progress.progressPercentage = Math.round((completedCount / totalLectures) * 100);
            }

            await progress.save();
        }

        res.status(200).json({
            success: true,
            message: 'Lecture marked as completed',
            progress: {
                completedLectures: progress.completedLectures,
                progressPercentage: progress.progressPercentage
            }
        });
    } catch (error) {
        console.error('Error marking lecture as completed:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update progress',
            error: error.message
        });
    }
};

// Get all progress for a student
export const getStudentProgress = async (req, res) => {
    try {
        const studentId = req.userId;

        const progressRecords = await Progress.find({ student: studentId })
            .populate('course', 'title thumbnail category')
            .populate('completedLectures', 'lectureTitle');

        res.status(200).json({
            success: true,
            progressRecords
        });
    } catch (error) {
        console.error('Error fetching student progress:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to fetch student progress',
            error: error.message
        });
    }
};

// Update last accessed lecture
export const updateLastAccessed = async (req, res) => {
    try {
        const { courseId, lectureId } = req.body;
        const studentId = req.userId;

        let progress = await Progress.findOne({
            student: studentId,
            course: courseId
        });

        if (!progress) {
            progress = await Progress.create({
                student: studentId,
                course: courseId,
                completedLectures: [],
                progressPercentage: 0
            });
        }

        progress.lastAccessedLecture = lectureId;
        progress.lastAccessed = Date.now();
        await progress.save();

        res.status(200).json({
            success: true,
            message: 'Last accessed lecture updated'
        });
    } catch (error) {
        console.error('Error updating last accessed lecture:', error);
        res.status(500).json({
            success: false,
            message: 'Failed to update last accessed lecture',
            error: error.message
        });
    }
};
