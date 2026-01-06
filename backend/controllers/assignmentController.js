
import { Assignment } from "../models/assignmentModel.js";
import Course from "../models/courseModel.js";
import Grade from "../models/gradeModel.js";

export const createAssignment = async (req, res) => {
    try {
        // 1. Get data from request
        const { courseId } = req.params;
        const { title, description, referenceLink, deadline } = req.body;
        const loggedInUserId = req.userId; // Correctly use req.userId from isAuth middleware

        // 2. Validation
        if (!title) {
            return res.status(400).json({ message: "Assignment title is required." });
        }

        // 3. Find the course
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // 4. Authorization: Check if the logged-in user is the creator of the course
        console.log("Debug Auth - Course Creator:", course.creator);
        console.log("Debug Auth - Logged In User:", loggedInUserId);
        
        if (course.creator.toString() !== loggedInUserId.toString()) {
            console.log("Auth Failed: Mismatch between creator and logged-in user");
            return res.status(403).json({ message: "Forbidden. You are not the creator of this course." });
        }

        // 5. Create the assignment
        const newAssignment = new Assignment({
            title,
            description,
            referenceLink,
            deadline,
            course: courseId,
        });

        // 6. Save the assignment and update the course
        await newAssignment.save();
        course.assignments.push(newAssignment._id);
        await course.save();

        // 7. Send success response
        return res.status(201).json({
            success: true,
            message: "Assignment created successfully.",
            assignment: newAssignment,
        });

    } catch (error) {
        console.error("Error in createAssignment controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};

export const gradeAssignment = async (req, res) => {
    try {
        const { assignmentId } = req.params;
        const { studentId, grade, feedback } = req.body;
        const loggedInUserId = req.userId;

        const assignment = await Assignment.findById(assignmentId).populate('course');
        if (!assignment) {
            return res.status(404).json({ message: "Assignment not found." });
        }

        if (assignment.course.creator.toString() !== loggedInUserId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not the creator of this course." });
        }

        const newGrade = new Grade({
            user: studentId,
            assignment: assignmentId,
            grade,
            feedback,
        });

        await newGrade.save();

        return res.status(201).json({
            success: true,
            message: "Assignment graded successfully.",
            grade: newGrade,
        });

    } catch (error) {
        console.error("Error in gradeAssignment controller:", error);
        return res.status(500).json({
            success: false,
            message: "An unexpected error occurred.",
            error: error.message,
        });
    }
};