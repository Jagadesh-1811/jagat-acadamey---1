import mongoose from 'mongoose';
import Course from "../models/courseModel.js"
import Lecture from "../models/lectureModel.js"
import User from "../models/userModel.js"
import uploadOnCloudinary from "../configs/cloudinary.js"

// create Courses
export const createCourse = async (req, res) => {

    try {
        const { title, category } = req.body
        if (!title || !category) {
            return res.status(400).json({ message: "title and category is required" })
        }
        const course = await Course.create({
            title,
            category,
            creator: req.userId
        })

        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to create course ${error}` })
    }

}

export const getPublishedCourses = async (req, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate("lectures reviews assignments")
        if (!courses) {
            return res.status(404).json({ message: "Course not found" })
        }

        return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get All  courses ${error}` })
    }
}


export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.userId
        const courses = await Course.find({ creator: userId }).populate('assignments')
        if (!courses) {
            return res.status(404).json({ message: "Course not found" })
        }
        return res.status(200).json(courses)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get creator courses ${error}` })
    }
}

export const editCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        let { title, subTitle, description, category, level, price, isPublished } = req.body;
        let thumbnail
        if (req.file) {
            thumbnail = await uploadOnCloudinary(req.file.path)
        }
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }

        // If level is an empty string, set it to undefined so Mongoose doesn't try to validate it against the enum
        if (level === '') {
            level = undefined;
        }

        const updateData = { title, subTitle, description, category, level, price, isPublished, thumbnail }

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true })
        return res.status(201).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to update course ${error}` })
    }
}


export const getCourseById = async (req, res) => {
    try {
        const { courseId } = req.params
        let course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        return res.status(200).json(course)

    } catch (error) {
        return res.status(500).json({ message: `Failed to get course ${error}` })
    }
}
export const removeCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const course = await Course.findById(courseId);

        if (!course) {
            return res.status(404).json({ message: "Course not found" });
        }

        await course.deleteOne();
        return res.status(200).json({ message: "Course Removed Successfully" });
    } catch (error) {
        console.error(error);
        return res.status(500).json({ message: `Failed to remove course ${error}` })
    }
};



//create lecture

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body
        const { courseId } = req.params

        if (!lectureTitle || !courseId) {
            return res.status(400).json({ message: "Lecture Title required" })
        }
        const lecture = await Lecture.create({ lectureTitle })
        const course = await Course.findById(courseId)
        if (course) {
            course.lectures.push(lecture._id)

            // Check if course.level is an empty string and set it to undefined
            if (course.level === '') {
                course.level = undefined;
            }
        }
        await course.populate("lectures")
        await course.save()
        return res.status(201).json({ lecture, course })

    } catch (error) {
        return res.status(500).json({ message: `Failed to Create Lecture ${error}` })
    }

}

export const getLecturesByCourseId = async (req, res) => {
    try {
        const { courseId } = req.params
        const course = await Course.findById(courseId)
        if (!course) {
            return res.status(404).json({ message: "Course not found" })
        }
        await course.populate("lectures")
        await course.save()
        return res.status(200).json(course)
    } catch (error) {
        return res.status(500).json({ message: `Failed to get Lectures ${error}` })
    }
}

export const editLecture = async (req, res) => {
    try {
        console.log("📝 Edit lecture request received")
        console.log("Lecture ID:", req.params.lectureId)
        console.log("Request body:", req.body)
        console.log("File received:", req.file ? `Yes - ${req.file.originalname}` : "No")

        const { lectureId } = req.params
        const { isPreviewFree, lectureTitle } = req.body
        const lecture = await Lecture.findById(lectureId)

        if (!lecture) {
            console.log("❌ Lecture not found:", lectureId)
            return res.status(404).json({ message: "Lecture not found" })
        }

        console.log("✅ Found lecture:", lecture.lectureTitle)

        let videoUrl
        if (req.file) {
            console.log("🎥 Uploading video to Cloudinary...")
            console.log("File path:", req.file.path)
            console.log("File size:", req.file.size, "bytes")

            videoUrl = await uploadOnCloudinary(req.file.path)

            if (!videoUrl) {
                console.log("❌ Cloudinary upload returned null")
                return res.status(500).json({ message: "Failed to upload video to Cloudinary" })
            }

            console.log("✅ Video URL from Cloudinary:", videoUrl)
            lecture.videoUrl = videoUrl
        }

        if (lectureTitle) {
            console.log("📝 Updating lecture title to:", lectureTitle)
            lecture.lectureTitle = lectureTitle
        }

        lecture.isPreviewFree = isPreviewFree
        console.log("🔓 Preview free:", isPreviewFree)

        await lecture.save()
        console.log("✅ Lecture updated successfully")

        return res.status(200).json(lecture)
    } catch (error) {
        console.error("❌ Edit lecture error:", error)
        return res.status(500).json({ message: `Failed to edit Lectures ${error}` })
    }

}

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params
        const lecture = await Lecture.findByIdAndDelete(lectureId)
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" })
        }
        //remove the lecture from associated course

        await Course.updateOne(
            { lectures: lectureId },
            { $pull: { lectures: lectureId } }
        )
        return res.status(200).json({ message: "Lecture Remove Successfully" })
    }

    catch (error) {
        return res.status(500).json({ message: `Failed to remove Lectures ${error}` })
    }
}



//get Creator data


// controllers/userController.js

export const getCreatorById = async (req, res) => {
    try {
        const { userId } = req.body;

        const user = await User.findById(userId).select("-password"); // Exclude password

        if (!user) {
            return res.status(404).json({ message: "User not found" });
        }

        res.status(200).json(user);
    } catch (error) {
        console.error("Error fetching user by ID:", error);
        res.status(500).json({ message: "get Creator error" });
    }
};

export const getLectureById = async (req, res) => {
    try {
        const { lectureId } = req.params;
        if (!lectureId || !mongoose.Types.ObjectId.isValid(lectureId)) {
            return res.status(400).json({ message: "Valid Lecture ID is required" });
        }
        const lecture = await Lecture.findById(lectureId);

        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found" });
        }

        res.status(200).json(lecture);
    } catch (error) {
        console.error("Error fetching lecture by ID:", error);
        res.status(500).json({ message: "Failed to get lecture" });
    }
};




