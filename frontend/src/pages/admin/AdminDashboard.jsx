import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft, FaUsers, FaChalkboardTeacher, FaMoneyBillWave, FaBook, FaCommentDots, FaBug, FaSignOutAlt, FaSync } from 'react-icons/fa';
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid, PieChart, Pie, Cell } from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalTeachers: 0,
        totalCourses: 0,
        totalRevenue: 0,
        feedbackCount: 0,
        issueCount: 0
    });
    const [courses, setCourses] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [adminData, setAdminData] = useState(null);

    useEffect(() => {
        // Check admin authentication
        const token = localStorage.getItem('adminToken');
        const admin = localStorage.getItem('adminData');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        if (admin) {
            setAdminData(JSON.parse(admin));
        }
        fetchData();

        // Auto-refresh every 30 seconds for live data
        const interval = setInterval(() => {
            fetchData(true);
        }, 30000);

        return () => clearInterval(interval);
    }, [navigate]);

    const fetchData = async () => {
        try {
            // Fetch courses
            let coursesData = [];
            try {
                const coursesRes = await axios.get(`${serverUrl}/api/course/allcourse`);
                coursesData = coursesRes.data?.courses || [];
            } catch (err) {
                console.log('Courses fetch failed:', err.message);
            }
            setCourses(coursesData);

            // Calculate stats from courses
            let totalRevenue = 0;
            let totalStudents = 0;
            coursesData.forEach(course => {
                const studentCount = course.enrolledStudents?.length || 0;
                totalStudents += studentCount;
                totalRevenue += (course.price || 0) * studentCount;
            });

            // Fetch feedbacks
            let feedbackData = [];
            try {
                const feedbackRes = await axios.get(`${serverUrl}/api/feedback/all`);
                feedbackData = feedbackRes.data || [];
            } catch (err) {
                console.log('Feedback fetch failed:', err.message);
            }
            setFeedbacks(feedbackData);

            const feedbackCount = feedbackData.filter(f => f.type === 'feedback').length;
            const issueCount = feedbackData.filter(f => f.type === 'issue').length;

            setStats({
                totalStudents,
                totalTeachers: new Set(coursesData.map(c => c.creator).filter(Boolean)).size,
                totalCourses: coursesData.length,
                totalRevenue,
                feedbackCount,
                issueCount
            });
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
        setRefreshing(false);
    };

    const handleRefresh = () => {
        setRefreshing(true);
        fetchData(true);
        toast.success('Dashboard refreshed!');
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    const revenueData = courses.map(course => ({
        name: course.title?.slice(0, 15) + '...' || 'Course',
        revenue: (course.price || 0) * (course.enrolledStudents?.length || 0),
        students: course.enrolledStudents?.length || 0,
        price: course.price || 0
    })).slice(0, 8);

    const pieData = [
        { name: 'Feedback', value: stats.feedbackCount, color: '#3B82F6' },
        { name: 'Issues', value: stats.issueCount, color: '#F59E0B' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <ClipLoader size={50} color="black" />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-black text-white py-6 px-6">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">Welcome, {adminData?.name || 'Admin'} • Platform Overview & Analytics</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        <button
                            onClick={() => navigate('/admin/feedback-manager')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <FaCommentDots className="w-4 h-4" />
                            Feedback Manager
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <FaSync className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-400 rounded-lg transition-colors"
                        >
                            <FaSignOutAlt className="w-4 h-4" />
                            Logout
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-8">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaUsers className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                                <p className="text-xs text-gray-500">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <FaChalkboardTeacher className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalTeachers}</p>
                                <p className="text-xs text-gray-500">Teachers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <FaBook className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                                <p className="text-xs text-gray-500">Courses</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <FaMoneyBillWave className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue.toLocaleString()}</p>
                                <p className="text-xs text-gray-500">Total Revenue</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <FaCommentDots className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.feedbackCount}</p>
                                <p className="text-xs text-gray-500">Feedback</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center">
                                <FaBug className="w-6 h-6 text-orange-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.issueCount}</p>
                                <p className="text-xs text-gray-500">Issues</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Charts */}
                <div className="grid lg:grid-cols-2 gap-6 mb-8">
                    {/* Revenue Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Revenue by Course</h2>
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={revenueData}>
                                <CartesianGrid strokeDasharray="3 3" />
                                <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                <YAxis />
                                <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                <Bar dataKey="revenue" fill="#000" radius={[5, 5, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>

                    {/* Feedback Pie Chart */}
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <h2 className="text-lg font-semibold mb-4">Feedback vs Issues</h2>
                        <div className="flex items-center justify-center">
                            <ResponsiveContainer width="100%" height={300}>
                                <PieChart>
                                    <Pie
                                        data={pieData}
                                        cx="50%"
                                        cy="50%"
                                        innerRadius={60}
                                        outerRadius={100}
                                        paddingAngle={5}
                                        dataKey="value"
                                        label={({ name, value }) => `${name}: ${value}`}
                                    >
                                        {pieData.map((entry, index) => (
                                            <Cell key={`cell-${index}`} fill={entry.color} />
                                        ))}
                                    </Pie>
                                    <Tooltip />
                                </PieChart>
                            </ResponsiveContainer>
                        </div>
                    </div>
                </div>

                {/* Course Details Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-8">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Course Revenue Details</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Students</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.map(course => (
                                    <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50">
                                        <td className="py-3 px-4">
                                            <div className="font-medium text-gray-900">{course.title}</div>
                                            <div className="text-xs text-gray-500">{course.category}</div>
                                        </td>
                                        <td className="py-3 px-4 text-gray-700">₹{course.price || 0}</td>
                                        <td className="py-3 px-4 text-gray-700">{course.enrolledStudents?.length || 0}</td>
                                        <td className="py-3 px-4 font-semibold text-gray-900">
                                            ₹{((course.price || 0) * (course.enrolledStudents?.length || 0)).toLocaleString()}
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-2 gap-6">
                    <div
                        onClick={() => navigate('/admin/feedback-manager')}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                <FaCommentDots className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">View Feedback & Issues</h3>
                                <p className="text-gray-500 text-sm">Manage user submissions</p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/contact')}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                <FaUsers className="w-7 h-7 text-green-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Contact Page</h3>
                                <p className="text-gray-500 text-sm">View contact information</p>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AdminDashboard;
