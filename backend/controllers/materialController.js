
import Material from "../models/materialModel.js";
import Course from "../models/courseModel.js";

export const uploadMaterial = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, url } = req.body;
        const educatorId = req.userId; // Get educator ID from authenticated user

        if (!title || !url) {
            return res.status(400).json({ message: "Title and URL are required" });
        }

        const newMaterial = new Material({
            title,
            url,
            course: courseId,
            educator: educatorId
        });

        await newMaterial.save();

        const course = await Course.findById(courseId);
        course.materials.push(newMaterial._id);
        await course.save();

        res.status(201).json(newMaterial);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const getMaterials = async (req, res) => {
    try {
        const { courseId } = req.params;
        const userId = req.userId; // Get current user's ID

        const course = await Course.findById(courseId).populate("materials");

        if (!course) {
            return res.status(404).json({ message: "Course not found." });
        }

        // Authorization check:
        // 1. If the user is the course creator (educator)
        // 2. If the user is an enrolled student in the course
        const isCourseCreator = course.creator.toString() === userId.toString();
        const isEnrolledStudent = course.enrolledStudents.includes(userId); // Assuming enrolledStudents stores user IDs

        if (!isCourseCreator && !isEnrolledStudent) {
            return res.status(403).json({ message: "Forbidden. You are not authorized to view materials for this course." });
        }

        res.status(200).json(course.materials);
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};

export const deleteMaterial = async (req, res) => {
    try {
        const { materialId } = req.params;
        const educatorId = req.userId; // Get current user's ID

        const material = await Material.findById(materialId);

        if (!material) {
            return res.status(404).json({ message: "Material not found" });
        }

        // Authorization check: Only the educator who uploaded the material can delete it
        if (material.educator.toString() !== educatorId.toString()) {
            return res.status(403).json({ message: "Forbidden. You are not authorized to delete this material." });
        }

        const course = await Course.findById(material.course);
        if (course) { // Ensure course exists before trying to modify its materials array
            course.materials.pull(materialId);
            await course.save();
        }

        await Material.findByIdAndDelete(materialId);

        res.status(200).json({ message: "Material deleted successfully" });
    } catch (error) {
        res.status(500).json({ message: error.message });
    }
};
