import Quiz from "../models/quizModel.js";
import Course from "../models/courseModel.js";

export const createQuiz = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { quizLink, liveSessionLink, instructions, rewards, schedule } = req.body;
        const loggedInUserId = req.userId;

        if (!quizLink || !liveSessionLink || !instructions || !rewards || !schedule) {
            return res.status(400).json({ message: "All quiz fields are required." });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        if (course.creator.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not the creator of this course." });
        }

        const newQuiz = new Quiz({
            course: courseId,
            educator: loggedInUserId,
            quizLink,
            liveSessionLink,
            instructions,
            rewards,
            schedule,
        });

        await newQuiz.save();

        // Add quiz to course (assuming courseModel has a 'quizzes' array)
        course.quizzes.push(newQuiz._id);
        await course.save();

        return res.status(201).json({
            success: true,
            message: "Quiz created successfully.",
            quiz: newQuiz,
        });

    } catch (error) {
        console.error("Error in createQuiz controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const getQuizzesByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const quizzes = await Quiz.find({ course: courseId }).populate('educator', 'fullName email');

        if (!quizzes) {
            return res.status(404).json({ message: "No quizzes found for this course." });
        }

        return res.status(200).json({
            success: true,
            quizzes,
        });

    } catch (error) {
        console.error("Error in getQuizzesByCourse controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const getQuizById = async (req, res) => {
    try {
        const { quizId } = req.params;
        const quiz = await Quiz.findById(quizId).populate('course').populate('educator', 'fullName email');

        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        return res.status(200).json({
            success: true,
            quiz,
        });

    } catch (error) {
        console.error("Error in getQuizById controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const updateQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const { quizLink, liveSessionLink, instructions, rewards, schedule } = req.body;
        const loggedInUserId = req.userId;

        const quiz = await Quiz.findById(quizId).populate('course');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.course.creator.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not the creator of this course." });
        }

        const updatedQuiz = await Quiz.findByIdAndUpdate(
            quizId,
            { quizLink, liveSessionLink, instructions, rewards, schedule },
            { new: true, runValidators: true }
        );

        return res.status(200).json({
            success: true,
            message: "Quiz updated successfully.",
            quiz: updatedQuiz,
        });

    } catch (error) {
        console.error("Error in updateQuiz controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const deleteQuiz = async (req, res) => {
    try {
        const { quizId } = req.params;
        const loggedInUserId = req.userId;

        const quiz = await Quiz.findById(quizId).populate('course');
        if (!quiz) {
            return res.status(404).json({ message: "Quiz not found." });
        }

        if (quiz.course.creator.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not the creator of this course." });
        }

        await Quiz.findByIdAndDelete(quizId);

        // Remove quiz from course's quizzes array
        await Course.findByIdAndUpdate(quiz.course._id, { $pull: { quizzes: quizId } });

        return res.status(200).json({
            success: true,
            message: "Quiz deleted successfully.",
        });

    } catch (error) {
        console.error("Error in deleteQuiz controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};
