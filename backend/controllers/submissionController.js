
import Submission from '../models/submissionModel.js';
import { Assignment } from '../models/assignmentModel.js';
import Course from '../models/courseModel.js';
import User from '../models/userModel.js';
import Grade from '../models/gradeModel.js';

export const submitAssignment = async (req, res) => {
    try {
        const { assignmentId, submissionLink } = req.body;
        const studentId = req.userId;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        if (!assignment.course) {
            return res.status(404).json({ message: 'Course not found for this assignment' });
        }

        // Fetch the user document to get their enrolled courses directly
        const user = await User.findById(studentId);
        if (!user) {
            return res.status(404).json({ message: 'Student not found' });
        }

        const isEnrolled = user.enrolledCourses.some(enrolledCourseId => enrolledCourseId.toString() === assignment.course.toString());
        if (!isEnrolled) {
            return res.status(403).json({ message: 'You are not enrolled in this course' });
        }

        const existingSubmission = await Submission.findOne({ assignment: assignmentId, student: studentId }).populate('grade');

        if (existingSubmission) {
            // Check if the submission was rejected - allow resubmission
            if (existingSubmission.grade && existingSubmission.grade.status === 'rejected') {
                // Delete the old grade and submission to allow resubmission
                await Grade.findByIdAndDelete(existingSubmission.grade._id);
                await Submission.findByIdAndDelete(existingSubmission._id);
            } else {
                return res.status(400).json({ message: 'You have already submitted this assignment' });
            }
        }

        const submission = new Submission({
            assignment: assignmentId,
            student: studentId,
            submissionLink
        });

        await submission.save();

        res.status(201).json({ message: 'Assignment submitted successfully', submission });

    } catch (error) {
        console.error("Error submitting assignment:", error);
        res.status(500).json({ message: "Internal server error during assignment submission.", error: error.message, stack: error.stack });
    }
};

export const getSubmissions = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const educatorId = req.userId;

        const assignment = await Assignment.findById(assignmentId);
        if (!assignment) {
            return res.status(404).json({ message: 'Assignment not found' });
        }

        const course = await Course.findById(assignment.course);
        if (!course) {
            return res.status(404).json({ message: 'Course not found' });
        }

        if (course.creator.toString() !== educatorId.toString()) {
            return res.status(403).json({ message: 'You are not authorized to view submissions for this assignment' });
        }

        const submissions = await Submission.find({ assignment: assignmentId }).populate('student', 'name').populate('grade');

        res.status(200).json({ submissions });

    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
