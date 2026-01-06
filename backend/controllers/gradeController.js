import Grade from "../models/gradeModel.js";
import Submission from "../models/submissionModel.js";
import { Assignment } from "../models/assignmentModel.js";
import Course from "../models/courseModel.js";
import User from "../models/userModel.js";

export const assignGrade = async (req, res) => {
    try {
        const { submissionId, grade, feedback, status } = req.body;
        const teacherId = req.userId; // From isAuth middleware

        // 1. Validate input
        if (!submissionId) {
            return res.status(400).json({ message: "Submission ID is required." });
        }

        // Check if this is a rejection or grading
        const isRejection = status === 'rejected';

        if (isRejection) {
            // For rejection, feedback is required
            if (!feedback || feedback.trim() === '') {
                return res.status(400).json({ message: "Feedback is required when rejecting a submission." });
            }
        } else {
            // For grading, grade is required
            if (!grade) {
                return res.status(400).json({ message: "Grade is required." });
            }
            if (!['A', 'B', 'C', 'D'].includes(grade.toUpperCase())) {
                return res.status(400).json({ message: "Invalid grade. Must be A, B, C, or D." });
            }
        }

        // 2. Find the submission and populate necessary fields
        const submission = await Submission.findById(submissionId).populate({
            path: 'assignment',
            populate: {
                path: 'course',
                select: 'creator'
            }
        });

        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        // 3. Authorization: Check if the teacher is the creator of the course
        const courseCreatorId = submission.assignment.course.creator;
        if (courseCreatorId.toString() !== teacherId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not authorized to grade this submission." });
        }

        // 4. Check if already graded (but allow re-grading after rejection)
        if (submission.grade) {
            const existingGrade = await Grade.findById(submission.grade);
            if (existingGrade && existingGrade.status !== 'rejected') {
                return res.status(400).json({ message: "Submission has already been graded." });
            }
            // If previously rejected, delete old grade to allow new submission
            if (existingGrade && existingGrade.status === 'rejected') {
                await Grade.findByIdAndDelete(submission.grade);
                submission.grade = null;
            }
        }

        // 5. Create the Grade document
        const newGrade = await Grade.create({
            submission: submissionId,
            student: submission.student,
            status: isRejection ? 'rejected' : 'graded',
            grade: isRejection ? '' : grade.toUpperCase(),
            feedback: feedback || ''
        });

        // 6. Update the Submission document to reference the new Grade
        submission.grade = newGrade._id;
        await submission.save();

        const message = isRejection ? "Submission rejected successfully." : "Grade assigned successfully.";
        return res.status(201).json({ message, grade: newGrade });

    } catch (error) {
        console.error("Error assigning grade:", error);
        return res.status(500).json({ message: "Internal server error while assigning grade." });
    }
};

export const getGradeForSubmission = async (req, res) => {
    try {
        const { submissionId } = req.params;

        const submission = await Submission.findById(submissionId).populate('grade');

        if (!submission) {
            return res.status(404).json({ message: "Submission not found." });
        }

        if (!submission.grade) {
            return res.status(404).json({ message: "Submission has not been graded yet." });
        }

        return res.status(200).json({ grade: submission.grade });

    } catch (error) {
        console.error("Error fetching grade for submission:", error);
        return res.status(500).json({ message: "Internal server error while fetching grade." });
    }
};

export const getStudentGrades = async (req, res) => {
    try {
        const studentId = req.userId; // From isAuth middleware

        const grades = await Grade.find({ student: studentId }).populate({
            path: 'submission',
            populate: {
                path: 'assignment',
                populate: {
                    path: 'course'
                }
            }
        });

        return res.status(200).json({ grades });

    } catch (error) {
        console.error("Error fetching student grades:", error);
        return res.status(500).json({ message: "Internal server error while fetching student grades." });
    }
};

export const getTeacherGrades = async (req, res) => {
    try {
        const teacherId = req.userId; // From isAuth middleware

        // 1. Find all courses created by this teacher
        const courses = await Course.find({ creator: teacherId }).select('_id');
        const courseIds = courses.map(course => course._id);

        // 2. Find all assignments belonging to these courses
        const assignments = await Assignment.find({ course: { $in: courseIds } }).select('_id');
        const assignmentIds = assignments.map(assignment => assignment._id);

        // 3. Find all submissions for these assignments and populate grade and student
        const submissionsWithGrades = await Submission.find({ assignment: { $in: assignmentIds } })
            .populate('grade')
            .populate('student', 'name email')
            .populate({
                path: 'assignment',
                populate: {
                    path: 'course',
                    select: 'title'
                }
            });

        return res.status(200).json({ submissions: submissionsWithGrades });

    } catch (error) {
        console.error("Error fetching teacher grades:", error);
        return res.status(500).json({ message: "Internal server error while fetching teacher grades." });
    }
};

export const getStudentAverageGrade = async (req, res) => {
    try {
        const studentId = req.userId; // From isAuth middleware

        const grades = await Grade.find({ student: studentId });

        if (grades.length === 0) {
            return res.status(200).json({ averageGrade: null, message: "No grades found for this student." });
        }

        const gradeMap = {
            'A': 4,
            'B': 3,
            'C': 2,
            'D': 1,
            'F': 0 // Assuming F for failing grades or ungraded
        };

        let totalPoints = 0;
        let gradedAssignments = 0;

        grades.forEach(gradeEntry => {
            const numericGrade = gradeMap[gradeEntry.grade.toUpperCase()];
            if (numericGrade !== undefined) {
                totalPoints += numericGrade;
                gradedAssignments++;
            }
        });

        const averageGrade = gradedAssignments > 0 ? (totalPoints / gradedAssignments).toFixed(2) : null;

        return res.status(200).json({ averageGrade });

    } catch (error) {
        console.error("Error fetching student average grade:", error);
        return res.status(500).json({ message: "Internal server error while fetching student average grade." });
    }
};