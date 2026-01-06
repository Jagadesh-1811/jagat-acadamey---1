import Module from "../models/moduleModel.js";
import Course from "../models/courseModel.js";
import Lecture from "../models/lectureModel.js";

// Create a new module for a course
export const createModule = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { title, description } = req.body;

        if (!title) {
            return res.status(400).json({ message: "Module title is required" });
        }

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        // Get the count of existing modules to set order
        const moduleCount = await Module.countDocuments({ course: courseId });

        const module = await Module.create({
            title,
            description,
            course: courseId,
            order: moduleCount
        });

        // Add module to course
        course.modules.push(module._id);
        await course.save();

        return res.status(201).json({ module, message: "Module created successfully" });
    } catch (error) {
        console.error("Create module error:", error);
        return res.status(500).json({ message: `Failed to create module: ${error.message}` });
    }
};

// Get all modules for a course with populated lectures
export const getModulesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params;

        const modules = await Module.find({ course: courseId })
            .populate("lectures")
            .sort({ order: 1 });

        return res.status(200).json({ modules });
    } catch (error) {
        console.error("Get modules error:", error);
        return res.status(500).json({ message: `Failed to get modules: ${error.message}` });
    }
};

// Update a module
export const updateModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { title, description } = req.body;

        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        if (title) module.title = title;
        if (description !== undefined) module.description = description;

        await module.save();

        return res.status(200).json({ module, message: "Module updated successfully" });
    } catch (error) {
        console.error("Update module error:", error);
        return res.status(500).json({ message: `Failed to update module: ${error.message}` });
    }
};

// Delete a module (and optionally its lectures)
export const deleteModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { deleteLectures } = req.query; // If true, delete lectures too

        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Remove module from course
        await Course.updateOne(
            { modules: moduleId },
            { $pull: { modules: moduleId } }
        );

        if (deleteLectures === "true") {
            // Delete all lectures in this module
            await Lecture.deleteMany({ _id: { $in: module.lectures } });
            // Also remove from course's lectures array
            await Course.updateOne(
                { _id: module.course },
                { $pull: { lectures: { $in: module.lectures } } }
            );
        } else {
            // Just unlink lectures from module
            await Lecture.updateMany(
                { _id: { $in: module.lectures } },
                { $unset: { module: 1 } }
            );
        }

        await module.deleteOne();

        return res.status(200).json({ message: "Module deleted successfully" });
    } catch (error) {
        console.error("Delete module error:", error);
        return res.status(500).json({ message: `Failed to delete module: ${error.message}` });
    }
};

// Reorder modules
export const reorderModules = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { moduleIds } = req.body; // Array of module IDs in new order

        if (!moduleIds || !Array.isArray(moduleIds)) {
            return res.status(400).json({ message: "Module IDs array is required" });
        }

        // Update order for each module
        const updatePromises = moduleIds.map((id, index) =>
            Module.findByIdAndUpdate(id, { order: index })
        );

        await Promise.all(updatePromises);

        return res.status(200).json({ message: "Modules reordered successfully" });
    } catch (error) {
        console.error("Reorder modules error:", error);
        return res.status(500).json({ message: `Failed to reorder modules: ${error.message}` });
    }
};

// Create lecture within a module
export const createLectureInModule = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { lectureTitle } = req.body;

        if (!lectureTitle) {
            return res.status(400).json({ message: "Lecture title is required" });
        }

        const module = await Module.findById(moduleId);
        if (!module) {
            return res.status(404).json({ message: "Module not found" });
        }

        // Get lecture count for order
        const lectureCount = module.lectures.length;

        const lecture = await Lecture.create({
            lectureTitle,
            module: moduleId,
            order: lectureCount
        });

        // Add lecture to module
        module.lectures.push(lecture._id);
        await module.save();

        // Also add to course's lectures array for backward compatibility
        await Course.updateOne(
            { _id: module.course },
            { $push: { lectures: lecture._id } }
        );

        return res.status(201).json({ lecture, message: "Lecture created successfully" });
    } catch (error) {
        console.error("Create lecture in module error:", error);
        return res.status(500).json({ message: `Failed to create lecture: ${error.message}` });
    }
};

// Reorder lectures within a module
export const reorderLectures = async (req, res) => {
    try {
        const { moduleId } = req.params;
        const { lectureIds } = req.body;

        if (!lectureIds || !Array.isArray(lectureIds)) {
            return res.status(400).json({ message: "Lecture IDs array is required" });
        }

        // Update order for each lecture
        const updatePromises = lectureIds.map((id, index) =>
            Lecture.findByIdAndUpdate(id, { order: index })
        );

        await Promise.all(updatePromises);

        // Update module's lectures array to match new order
        await Module.findByIdAndUpdate(moduleId, { lectures: lectureIds });

        return res.status(200).json({ message: "Lectures reordered successfully" });
    } catch (error) {
        console.error("Reorder lectures error:", error);
        return res.status(500).json({ message: `Failed to reorder lectures: ${error.message}` });
    }
};
