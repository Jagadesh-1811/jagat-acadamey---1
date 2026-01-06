import uploadOnCloudinary from "../configs/cloudinary.js";
import User from "../models/userModel.js";
import Resume from "../models/resumeModel.js";
import Certification from "../models/certificationModel.js";
import Grade from "../models/gradeModel.js";


export const getResume = async (req, res) => {
    try {
        let resume = await Resume.findOne({ user: req.userId });
        if (!resume) {
            // If no resume exists, create a new one with default values
            resume = new Resume({ user: req.userId });
            await resume.save();
        }
        res.status(200).json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching resume" });
    }
};

export const updateResume = async (req, res) => {
    try {
        const resume = await Resume.findOneAndUpdate(
            { user: req.userId },
            { ...req.body },
            { new: true, upsert: true } // `new` returns the updated doc, `upsert` creates it if it doesn't exist
        );
        res.status(200).json(resume);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error updating resume" });
    }
};

export const getCertifications = async (req, res) => {
    try {
        const certifications = await Certification.find({ user: req.userId });
        res.status(200).json(certifications);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching certifications" });
    }
};

export const submitCertification = async (req, res) => {
    try {
        const newCertification = new Certification({
            ...req.body,
            user: req.userId
        });
        await newCertification.save();
        res.status(201).json(newCertification);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error submitting certification" });
    }
};

export const getGrades = async (req, res) => {
    try {
        const grades = await Grade.find({ user: req.userId });
        res.status(200).json(grades);
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: "Error fetching grades" });
    }
};


export const getCurrentUser = async (req, res) => {
    try {
        const user = await User.findById(req.userId).select("-password").populate("enrolledCourses")
        if (!user) {
            return res.status(400).json({ message: "user does not found" })
        }
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(400).json({ message: "get current user error" })
    }
}

export const UpdateProfile = async (req, res) => {
    try {
        const userId = req.userId
        const { name, description } = req.body
        let photoUrl
        if (req.file) {
            photoUrl = await uploadOnCloudinary(req.file.path)
        }
        const user = await User.findByIdAndUpdate(userId, { name, description, photoUrl })


        if (!user) {
            return res.status(404).json({ message: "User not found" })
        }
        await user.save()
        return res.status(200).json(user)
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: `Update Profile Error  ${error}` })
    }
}

// Get user profile by ID (public info)
export const getUserById = async (req, res) => {
    try {
        const { userId } = req.params;
        const user = await User.findById(userId).select('name email photoUrl role description');

        if (!user) {
            return res.status(404).json({ success: false, message: "User not found" });
        }

        return res.status(200).json({ success: true, user });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ success: false, message: "Error fetching user profile" });
    }
}

