import Feedback from "../models/feedbackModel.js";

// Create new feedback or issue
export const createFeedback = async (req, res) => {
    try {
        const { type, name, email, subject, message, userId } = req.body;

        if (!type || !name || !email || !subject || !message) {
            return res.status(400).json({ message: "All fields are required" });
        }

        const feedback = await Feedback.create({
            type,
            name,
            email,
            subject,
            message,
            userId: userId || null
        });

        console.log(`New ${type} received from ${email}: ${subject}`);

        return res.status(201).json({
            message: `${type === "feedback" ? "Feedback" : "Issue"} submitted successfully`,
            feedback
        });
    } catch (error) {
        console.error("Create feedback error:", error);
        return res.status(500).json({ message: "Failed to submit. Please try again." });
    }
};

// Get all feedback/issues (for admin)
export const getAllFeedback = async (req, res) => {
    try {
        const feedbacks = await Feedback.find({}).sort({ createdAt: -1 });
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Get feedback error:", error);
        return res.status(500).json({ message: "Failed to fetch feedback" });
    }
};

// Get feedback by user email
export const getUserFeedback = async (req, res) => {
    try {
        const { email } = req.params;
        const feedbacks = await Feedback.find({ email }).sort({ createdAt: -1 });
        return res.status(200).json(feedbacks);
    } catch (error) {
        console.error("Get user feedback error:", error);
        return res.status(500).json({ message: "Failed to fetch feedback" });
    }
};

// Update feedback status
export const updateFeedbackStatus = async (req, res) => {
    try {
        const { id } = req.params;
        const { status } = req.body;

        const feedback = await Feedback.findByIdAndUpdate(
            id,
            { status },
            { new: true }
        );

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        return res.status(200).json({ message: "Status updated", feedback });
    } catch (error) {
        console.error("Update feedback error:", error);
        return res.status(500).json({ message: "Failed to update status" });
    }
};

// Delete feedback
export const deleteFeedback = async (req, res) => {
    try {
        const { id } = req.params;

        const feedback = await Feedback.findByIdAndDelete(id);

        if (!feedback) {
            return res.status(404).json({ message: "Feedback not found" });
        }

        return res.status(200).json({ message: "Feedback deleted successfully" });
    } catch (error) {
        console.error("Delete feedback error:", error);
        return res.status(500).json({ message: "Failed to delete feedback" });
    }
};
