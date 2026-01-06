import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg";
import { useNavigate } from 'react-router-dom';
import { FaArrowLeft, FaBook, FaUsers, FaMoneyBillWave, FaClipboardList, FaTrophy, FaGraduationCap, FaHandSparkles, FaHourglassHalf } from "react-icons/fa";
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import 'react-toastify/dist/ReactToastify.css';
import QuizManager from './QuizManager';
import ChatList from '../../components/ChatList';

const getGradeColor = (grade, isBackground = false) => {
    switch (grade) {
        case 'A': return isBackground ? '#D4EDDA' : '#28A745';
        case 'B': return isBackground ? '#CCE5FF' : '#007BFF';
        case 'C': return isBackground ? '#FFF3CD' : '#FFC107';
        case 'D': return isBackground ? '#F8D7DA' : '#DC3545';
        default: return isBackground ? '#E2E6EA' : '#6C757D';
    }
};

function Dashboard() {
    const navigate = useNavigate()
    const { userData, token } = useSelector((state) => state.user);
    const { creatorCourseData } = useSelector((state) => state.course);
    const [submissions, setSubmissions] = useState({});
    const [grades, setGrades] = useState({});
    const [feedback, setFeedback] = useState({});
    const [submittingGrade, setSubmittingGrade] = useState(false);
    const [loadingSubmissions, setLoadingSubmissions] = useState(true);
    const [activeTab, setActiveTab] = useState('overview');

    const handleGradeChange = (submissionId, value) => {
        setGrades(prev => ({ ...prev, [submissionId]: value }));
    };

    const handleFeedbackChange = (submissionId, value) => {
        setFeedback(prev => ({ ...prev, [submissionId]: value }));
    };

    const assignGrade = async (submissionId, assignmentId) => {
        setSubmittingGrade(true);
        try {
            const selectedGrade = grades[submissionId];
            const selectedFeedback = feedback[submissionId];

            if (!selectedGrade) {
                toast.error("Please select a grade.");
                setSubmittingGrade(false);
                return;
            }

            if (!submissionId || !assignmentId) {
                toast.error("Submission or Assignment ID missing.");
                setSubmittingGrade(false);
                return;
            }

            await axios.post(
                `${serverUrl}/api/grade/assign`,
                { submissionId, assignmentId, grade: selectedGrade, feedback: selectedFeedback || "" },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            const { data } = await axios.get(
                `${serverUrl}/api/submission/${assignmentId}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setSubmissions(prevSubmissions => ({
                ...prevSubmissions,
                [assignmentId]: data.submissions
            }));
            toast.success("Grade assigned successfully!");
        } catch (error) {
            console.error("Error assigning grade:", error);
            toast.error(error.response?.data?.message || error.message || "Failed to assign grade.");
        } finally {
            setSubmittingGrade(false);
        }
    };

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                setLoadingSubmissions(true);
                const newSubmissions = {};
                for (const course of creatorCourseData) {
                    if (course.assignments) {
                        for (const assignment of course.assignments) {
                            if (assignment && assignment._id) {
                                const { data } = await axios.get(
                                    `${serverUrl}/api/submission/${assignment._id}`,
                                    { headers: { Authorization: `Bearer ${token}` } }
                                );
                                newSubmissions[assignment._id] = data.submissions;
                            }
                        }
                    }
                }
                setSubmissions(newSubmissions);
            } catch (error) {
                console.error("Error fetching submissions:", error);
            } finally {
                setLoadingSubmissions(false);
            }
        };

        if (creatorCourseData) {
            fetchSubmissions();
        }
    }, [creatorCourseData, token]);

    const courseProgressData = creatorCourseData?.map(course => ({
        name: course.title.slice(0, 10) + "...",
        lectures: course.lectures.length || 0
    })) || [];

    const enrollData = creatorCourseData?.map(course => ({
        name: course.title.slice(0, 10) + "...",
        enrolled: course.enrolledStudents?.length || 0
    })) || [];

    const totalEarnings = creatorCourseData?.reduce((sum, course) => {
        const studentCount = course.enrolledStudents?.length || 0;
        const courseRevenue = course.price ? course.price * studentCount : 0;
        return sum + courseRevenue;
    }, 0) || 0;

    const totalStudents = creatorCourseData?.reduce((sum, course) => sum + (course.enrolledStudents?.length || 0), 0) || 0;
    const totalLectures = creatorCourseData?.reduce((sum, course) => sum + (course.lectures?.length || 0), 0) || 0;
    const totalAssignments = creatorCourseData?.reduce((sum, course) => sum + (course.assignments?.length || 0), 0) || 0;
    const pendingSubmissions = Object.values(submissions).flat().filter(s => !s.grade).length;

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate("/")}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div className="flex items-center gap-4">
                            <img
                                src={userData?.photoUrl || img}
                                alt="Profile"
                                className="w-12 h-12 rounded-full object-cover border-2 border-white/20"
                            />
                            <div>
                                <h1>Welcome, {userData?.name || "Educator"} <FaHandSparkles className="inline text-yellow-500" /></h1>
                                <p>{userData?.description || "Manage your courses and students"}</p>
                            </div>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="text-right hidden md:block">
                            <p className="text-2xl font-bold text-white">₹{totalEarnings.toLocaleString()}</p>
                            <p className="text-gray-400 text-sm">Total Earnings</p>
                        </div>
                        <button
                            onClick={() => navigate("/courses")}
                            className="admin-btn admin-btn-primary"
                        >
                            <FaBook className="w-4 h-4" />
                            <span className="hidden sm:inline">Manage Courses</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6 space-y-6">
                {/* Stats Grid */}
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-dark">
                                <FaBook className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{creatorCourseData?.length || 0}</p>
                                <p className="admin-stat-label">Total Courses</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-light">
                                <FaUsers className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{totalStudents}</p>
                                <p className="admin-stat-label">Students</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-dark">
                                <FaGraduationCap className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{totalLectures}</p>
                                <p className="admin-stat-label">Lectures</p>
                            </div>
                        </div>
                    </div>

                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-light">
                                <FaClipboardList className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{pendingSubmissions}</p>
                                <p className="admin-stat-label">Pending Reviews</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Tab Navigation */}
                <div className="flex gap-2 bg-white p-2 rounded-xl border border-gray-200">
                    {['overview', 'submissions', 'quizzes'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setActiveTab(tab)}
                            className={`flex-1 py-3 px-4 rounded-lg font-semibold text-sm transition-all duration-200 capitalize ${activeTab === tab
                                ? 'bg-black text-white'
                                : 'text-gray-600 hover:bg-gray-100'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Overview Tab */}
                {activeTab === 'overview' && (
                    <div className="grid md:grid-cols-2 gap-6">
                        {/* Course Progress Chart */}
                        <div className="admin-card">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaBook className="text-gray-400" />
                                Course Progress (Lectures)
                            </h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={courseProgressData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="lectures" fill="#000" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Student Enrollment Chart */}
                        <div className="admin-card">
                            <h2 className="text-lg font-bold mb-4 flex items-center gap-2">
                                <FaUsers className="text-gray-400" />
                                Student Enrollment
                            </h2>
                            <ResponsiveContainer width="100%" height={280}>
                                <BarChart data={enrollData}>
                                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e5e5" />
                                    <XAxis dataKey="name" tick={{ fontSize: 12 }} />
                                    <YAxis />
                                    <Tooltip
                                        contentStyle={{
                                            background: '#000',
                                            border: 'none',
                                            borderRadius: '8px',
                                            color: '#fff'
                                        }}
                                    />
                                    <Bar dataKey="enrolled" fill="#404040" radius={[8, 8, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                )}

                {/* Submissions Tab */}
                {activeTab === 'submissions' && (
                    <div className="admin-card">
                        <h2 className="text-xl font-bold mb-6 flex items-center gap-2">
                            <FaClipboardList className="text-gray-400" />
                            Assignment Submissions
                        </h2>
                        {loadingSubmissions ? (
                            <div className="flex justify-center items-center h-40">
                                <ClipLoader size={40} color={'#000'} />
                            </div>
                        ) : (
                            <div className="space-y-6">
                                {creatorCourseData?.map((course) => (
                                    <div key={course._id} className="border-b border-gray-100 pb-6 last:border-0">
                                        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
                                            <span className="w-2 h-2 bg-black rounded-full"></span>
                                            {course.title}
                                        </h3>
                                        {course.assignments?.length === 0 ? (
                                            <p className="text-gray-500 text-sm pl-4">No assignments yet</p>
                                        ) : (
                                            course.assignments?.map((assignment) => (
                                                <div key={assignment._id} className="admin-list-item flex-col items-start gap-4 cursor-default hover:transform-none">
                                                    <div className="flex items-center justify-between w-full">
                                                        <h4 className="font-semibold">{assignment.title}</h4>
                                                        <span className="admin-badge admin-badge-dark">
                                                            {submissions[assignment._id]?.length || 0} submissions
                                                        </span>
                                                    </div>

                                                    {submissions[assignment._id]?.length > 0 && (
                                                        <div className="w-full space-y-3 mt-2">
                                                            {submissions[assignment._id]?.map((submission) => (
                                                                <div key={submission._id} className="bg-gray-50 rounded-lg p-4">
                                                                    <div className="flex items-center justify-between mb-2">
                                                                        <div className="flex items-center gap-3">
                                                                            <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                                                {submission.student.name?.charAt(0)?.toUpperCase()}
                                                                            </div>
                                                                            <span className="font-medium">{submission.student.name}</span>
                                                                        </div>
                                                                        <a
                                                                            href={submission.submissionLink}
                                                                            target="_blank"
                                                                            rel="noopener noreferrer"
                                                                            className="text-sm px-3 py-1 bg-white border border-gray-200 rounded-lg hover:border-black transition-colors"
                                                                        >
                                                                            View Submission →
                                                                        </a>
                                                                    </div>

                                                                    {submission.grade ? (
                                                                        <div
                                                                            className="mt-3 p-3 rounded-lg"
                                                                            style={{ backgroundColor: getGradeColor(submission.grade.grade, true) }}
                                                                        >
                                                                            <div className="flex items-center gap-2">
                                                                                <FaTrophy style={{ color: getGradeColor(submission.grade.grade) }} />
                                                                                <span className="font-bold" style={{ color: getGradeColor(submission.grade.grade) }}>
                                                                                    Grade: {submission.grade.grade}
                                                                                </span>
                                                                            </div>
                                                                            {submission.grade.feedback && (
                                                                                <p className="text-gray-700 text-sm mt-1">
                                                                                    Feedback: {submission.grade.feedback}
                                                                                </p>
                                                                            )}
                                                                        </div>
                                                                    ) : (
                                                                        <div className="mt-3 p-3 bg-yellow-50 rounded-lg border border-yellow-100">
                                                                            <p className="text-sm font-semibold text-yellow-800 mb-3 flex items-center gap-2"><FaHourglassHalf /> Pending Review</p>
                                                                            <div className="flex flex-col sm:flex-row gap-2">
                                                                                <select
                                                                                    className="admin-input admin-select flex-shrink-0 sm:w-32"
                                                                                    value={grades[submission._id] || ''}
                                                                                    onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                                                                                >
                                                                                    <option value="">Grade</option>
                                                                                    <option value="A">A</option>
                                                                                    <option value="B">B</option>
                                                                                    <option value="C">C</option>
                                                                                    <option value="D">D</option>
                                                                                </select>
                                                                                <input
                                                                                    type="text"
                                                                                    className="admin-input flex-1"
                                                                                    placeholder="Add feedback..."
                                                                                    value={feedback[submission._id] || ''}
                                                                                    onChange={(e) => handleFeedbackChange(submission._id, e.target.value)}
                                                                                />
                                                                                <button
                                                                                    className="admin-btn admin-btn-primary flex-shrink-0"
                                                                                    onClick={() => assignGrade(submission._id, assignment._id)}
                                                                                    disabled={submittingGrade}
                                                                                >
                                                                                    {submittingGrade ? <ClipLoader size={16} color={'white'} /> : 'Submit'}
                                                                                </button>
                                                                            </div>
                                                                        </div>
                                                                    )}
                                                                </div>
                                                            ))}
                                                        </div>
                                                    )}
                                                </div>
                                            ))
                                        )}
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>
                )}

                {/* Quizzes Tab */}
                {activeTab === 'quizzes' && (
                    <QuizManager />
                )}
            </div>

            {/* Chat List for Educator Messages */}
            <ChatList />
        </div>
    );
}

export default Dashboard;
