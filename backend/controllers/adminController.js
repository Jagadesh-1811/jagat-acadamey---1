import User from "../models/userModel.js";
import Course from "../models/courseModel.js";

// Get dashboard statistics
export const getDashboardStats = async (req, res) => {
    try {
        // Get total counts
        const totalStudents = await User.countDocuments({ role: "student" });
        const totalEducators = await User.countDocuments({ role: "educator" });
        const totalUsers = await User.countDocuments();

        // Get courses with populated data
        const courses = await Course.find().populate('enrolledStudents', 'name email');
        const totalCourses = courses.length;
        const publishedCourses = courses.filter(c => c.isPublished).length;

        // Calculate total revenue
        let totalRevenue = 0;
        let totalEnrollments = 0;
        courses.forEach(course => {
            const enrollmentCount = course.enrolledStudents?.length || 0;
            totalEnrollments += enrollmentCount;
            totalRevenue += (course.price || 0) * enrollmentCount;
        });

        // Get today's stats
        const today = new Date();
        today.setHours(0, 0, 0, 0);

        const newUsersToday = await User.countDocuments({
            createdAt: { $gte: today }
        });

        const newStudentsToday = await User.countDocuments({
            role: "student",
            createdAt: { $gte: today }
        });

        const newEducatorsToday = await User.countDocuments({
            role: "educator",
            createdAt: { $gte: today }
        });

        // Get this week's stats
        const weekAgo = new Date();
        weekAgo.setDate(weekAgo.getDate() - 7);

        const newUsersThisWeek = await User.countDocuments({
            createdAt: { $gte: weekAgo }
        });

        return res.status(200).json({
            totalStudents,
            totalEducators,
            totalUsers,
            totalCourses,
            publishedCourses,
            totalRevenue,
            totalEnrollments,
            newUsersToday,
            newStudentsToday,
            newEducatorsToday,
            newUsersThisWeek,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error("Dashboard stats error:", error);
        return res.status(500).json({ message: `Error fetching stats: ${error}` });
    }
};

// Get all users with optional filters
export const getAllUsers = async (req, res) => {
    try {
        const { role, limit = 50, page = 1 } = req.query;

        const filter = {};
        if (role && role !== 'all') {
            filter.role = role;
        }

        const skip = (page - 1) * limit;

        const users = await User.find(filter)
            .select("-password -resetOtp -otpExpires")
            .sort({ createdAt: -1 })
            .skip(skip)
            .limit(parseInt(limit))
            .populate('enrolledCourses', 'title price');

        const total = await User.countDocuments(filter);

        return res.status(200).json({
            users,
            total,
            page: parseInt(page),
            totalPages: Math.ceil(total / limit)
        });

    } catch (error) {
        console.error("Get users error:", error);
        return res.status(500).json({ message: `Error fetching users: ${error}` });
    }
};

// Get recently joined users
export const getRecentUsers = async (req, res) => {
    try {
        const { limit = 10, hours = 24 } = req.query;

        const since = new Date();
        since.setHours(since.getHours() - parseInt(hours));

        const recentUsers = await User.find({
            createdAt: { $gte: since }
        })
            .select("-password -resetOtp -otpExpires")
            .sort({ createdAt: -1 })
            .limit(parseInt(limit));

        return res.status(200).json({
            users: recentUsers,
            count: recentUsers.length,
            since: since.toISOString()
        });

    } catch (error) {
        console.error("Recent users error:", error);
        return res.status(500).json({ message: `Error fetching recent users: ${error}` });
    }
};

// Get recent enrollments
export const getRecentEnrollments = async (req, res) => {
    try {
        const { limit = 10 } = req.query;

        // Get courses with enrolled students, populate student info
        const courses = await Course.find({
            enrolledStudents: { $exists: true, $ne: [] }
        })
            .populate({
                path: 'enrolledStudents',
                select: 'name email createdAt photoUrl',
                options: { sort: { createdAt: -1 } }
            })
            .select('title price thumbnail enrolledStudents createdAt');

        // Flatten enrollments into a list
        const enrollments = [];
        courses.forEach(course => {
            course.enrolledStudents?.forEach(student => {
                enrollments.push({
                    student: {
                        _id: student._id,
                        name: student.name,
                        email: student.email,
                        photoUrl: student.photoUrl
                    },
                    course: {
                        _id: course._id,
                        title: course.title,
                        price: course.price,
                        thumbnail: course.thumbnail
                    },
                    // Use student's createdAt as enrollment proxy (can be improved with actual enrollment date)
                    enrolledAt: student.createdAt
                });
            });
        });

        // Sort by enrollment date and limit
        enrollments.sort((a, b) => new Date(b.enrolledAt) - new Date(a.enrolledAt));
        const recentEnrollments = enrollments.slice(0, parseInt(limit));

        return res.status(200).json({
            enrollments: recentEnrollments,
            count: recentEnrollments.length
        });

    } catch (error) {
        console.error("Recent enrollments error:", error);
        return res.status(500).json({ message: `Error fetching enrollments: ${error}` });
    }
};

// Get activity feed (combines recent users and enrollments)
export const getActivityFeed = async (req, res) => {
    try {
        const { limit = 20 } = req.query;

        const activities = [];

        // Get recent user registrations
        const recentUsers = await User.find()
            .select("name email role photoUrl createdAt")
            .sort({ createdAt: -1 })
            .limit(20);

        recentUsers.forEach(user => {
            activities.push({
                type: 'registration',
                message: `${user.name} registered as a ${user.role}`,
                user: {
                    name: user.name,
                    email: user.email,
                    role: user.role,
                    photoUrl: user.photoUrl
                },
                timestamp: user.createdAt
            });
        });

        // Get courses with recent enrollments
        const courses = await Course.find({
            enrolledStudents: { $exists: true, $ne: [] }
        })
            .populate({
                path: 'enrolledStudents',
                select: 'name email photoUrl createdAt'
            })
            .select('title price');

        courses.forEach(course => {
            course.enrolledStudents?.forEach(student => {
                activities.push({
                    type: 'enrollment',
                    message: `${student.name} enrolled in "${course.title}"`,
                    user: {
                        name: student.name,
                        email: student.email,
                        photoUrl: student.photoUrl
                    },
                    course: {
                        title: course.title,
                        price: course.price
                    },
                    revenue: course.price || 0,
                    timestamp: student.createdAt
                });
            });
        });

        // Sort by timestamp and limit
        activities.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp));
        const recentActivities = activities.slice(0, parseInt(limit));

        return res.status(200).json({
            activities: recentActivities,
            count: recentActivities.length,
            lastUpdated: new Date().toISOString()
        });

    } catch (error) {
        console.error("Activity feed error:", error);
        return res.status(500).json({ message: `Error fetching activity feed: ${error}` });
    }
};

// Get course statistics
export const getCourseStats = async (req, res) => {
    try {
        const courses = await Course.find()
            .populate('enrolledStudents', 'name')
            .populate('creator', 'name email')
            .select('title price enrolledStudents creator isPublished category createdAt');

        const courseStats = courses.map(course => ({
            _id: course._id,
            title: course.title,
            price: course.price || 0,
            enrollmentCount: course.enrolledStudents?.length || 0,
            revenue: (course.price || 0) * (course.enrolledStudents?.length || 0),
            creator: course.creator,
            isPublished: course.isPublished,
            category: course.category,
            createdAt: course.createdAt
        }));

        // Sort by revenue
        courseStats.sort((a, b) => b.revenue - a.revenue);

        return res.status(200).json({
            courses: courseStats,
            count: courseStats.length
        });

    } catch (error) {
        console.error("Course stats error:", error);
        return res.status(500).json({ message: `Error fetching course stats: ${error}` });
    }
};

// ==================== EDUCATOR APPROVAL MANAGEMENT ====================

// Get all pending educator requests
export const getPendingEducators = async (req, res) => {
    try {
        const pendingEducators = await User.find({
            role: "educator",
            approvalStatus: "pending"
        })
            .select("-password -verificationToken -verificationTokenExpires")
            .sort({ createdAt: -1 });

        return res.status(200).json({
            educators: pendingEducators,
            count: pendingEducators.length
        });

    } catch (error) {
        console.error("Get pending educators error:", error);
        return res.status(500).json({ message: `Error fetching pending educators: ${error}` });
    }
};

// Get all educators with their approval status
export const getAllEducators = async (req, res) => {
    try {
        const { status } = req.query; // 'pending', 'approved', 'rejected', or 'all'

        const filter = { role: "educator" };
        if (status && status !== 'all') {
            filter.approvalStatus = status;
        }

        const educators = await User.find(filter)
            .select("-password -verificationToken -verificationTokenExpires")
            .sort({ createdAt: -1 });

        // Get counts for each status
        const counts = {
            pending: await User.countDocuments({ role: "educator", approvalStatus: "pending" }),
            approved: await User.countDocuments({ role: "educator", approvalStatus: "approved" }),
            rejected: await User.countDocuments({ role: "educator", approvalStatus: "rejected" }),
            total: await User.countDocuments({ role: "educator" })
        };

        return res.status(200).json({
            educators,
            counts
        });

    } catch (error) {
        console.error("Get all educators error:", error);
        return res.status(500).json({ message: `Error fetching educators: ${error}` });
    }
};

// Approve an educator
export const approveEducator = async (req, res) => {
    try {
        const { educatorId } = req.params;
        const { note } = req.body;

        const educator = await User.findById(educatorId);

        if (!educator) {
            return res.status(404).json({ message: "Educator not found" });
        }

        if (educator.role !== "educator") {
            return res.status(400).json({ message: "User is not an educator" });
        }

        educator.approvalStatus = "approved";
        educator.approvalNote = note || "Approved by admin";
        educator.approvedAt = new Date();
        await educator.save();

        return res.status(200).json({
            message: "Educator approved successfully",
            educator: {
                _id: educator._id,
                name: educator.name,
                email: educator.email,
                approvalStatus: educator.approvalStatus,
                approvedAt: educator.approvedAt
            }
        });

    } catch (error) {
        console.error("Approve educator error:", error);
        return res.status(500).json({ message: `Error approving educator: ${error}` });
    }
};

// Reject an educator
export const rejectEducator = async (req, res) => {
    try {
        const { educatorId } = req.params;
        const { note } = req.body;

        if (!note || note.trim() === '') {
            return res.status(400).json({ message: "Rejection reason is required" });
        }

        const educator = await User.findById(educatorId);

        if (!educator) {
            return res.status(404).json({ message: "Educator not found" });
        }

        if (educator.role !== "educator") {
            return res.status(400).json({ message: "User is not an educator" });
        }

        educator.approvalStatus = "rejected";
        educator.approvalNote = note;
        await educator.save();

        return res.status(200).json({
            message: "Educator rejected",
            educator: {
                _id: educator._id,
                name: educator.name,
                email: educator.email,
                approvalStatus: educator.approvalStatus,
                approvalNote: educator.approvalNote
            }
        });

    } catch (error) {
        console.error("Reject educator error:", error);
        return res.status(500).json({ message: `Error rejecting educator: ${error}` });
    }
};

// Delete an educator account
export const deleteEducator = async (req, res) => {
    try {
        const { educatorId } = req.params;

        const educator = await User.findById(educatorId);

        if (!educator) {
            return res.status(404).json({ message: "Educator not found" });
        }

        if (educator.role !== "educator") {
            return res.status(400).json({ message: "User is not an educator" });
        }

        await User.findByIdAndDelete(educatorId);

        return res.status(200).json({
            message: "Educator account deleted successfully"
        });

    } catch (error) {
        console.error("Delete educator error:", error);
        return res.status(500).json({ message: `Error deleting educator: ${error}` });
    }
};
