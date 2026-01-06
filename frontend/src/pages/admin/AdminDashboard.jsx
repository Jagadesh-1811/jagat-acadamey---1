import React, { useState, useEffect, useCallback } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import GroupIcon from '@mui/icons-material/Group';
import SchoolIcon from '@mui/icons-material/School';
import PaymentsIcon from '@mui/icons-material/Payments';
import BookIcon from '@mui/icons-material/Book';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import BugReportIcon from '@mui/icons-material/BugReport';
import LogoutIcon from '@mui/icons-material/Logout';
import SyncIcon from '@mui/icons-material/Sync';
import PersonAddIcon from '@mui/icons-material/PersonAdd';
import SchoolOutlinedIcon from '@mui/icons-material/SchoolOutlined';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ShowChartIcon from '@mui/icons-material/ShowChart';
import PersonIcon from '@mui/icons-material/Person';
import MicIcon from '@mui/icons-material/Mic';
import MenuBookIcon from '@mui/icons-material/MenuBook';
import PersonAddOutlinedIcon from '@mui/icons-material/PersonAddOutlined';
import {
    BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
    PieChart, Pie, Cell, LineChart, Line, Area, AreaChart
} from 'recharts';

const AdminDashboard = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalStudents: 0,
        totalEducators: 0,
        totalUsers: 0,
        totalCourses: 0,
        publishedCourses: 0,
        totalRevenue: 0,
        totalEnrollments: 0,
        newUsersToday: 0,
        newStudentsToday: 0,
        newEducatorsToday: 0,
        newUsersThisWeek: 0,
        feedbackCount: 0,
        issueCount: 0
    });
    const [courses, setCourses] = useState([]);
    const [recentUsers, setRecentUsers] = useState([]);
    const [activityFeed, setActivityFeed] = useState([]);
    const [feedbacks, setFeedbacks] = useState([]);
    const [doubtSessions, setDoubtSessions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [adminData, setAdminData] = useState(null);
    const [lastUpdated, setLastUpdated] = useState(new Date());
    const [autoRefresh, setAutoRefresh] = useState(true);

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
        fetchAllData();

        // Auto-refresh every 10 seconds for live data
        let interval;
        if (autoRefresh) {
            interval = setInterval(() => {
                fetchAllData(true);
            }, 10000);
        }

        return () => {
            if (interval) clearInterval(interval);
        };
    }, [navigate, autoRefresh]);

    const fetchAllData = useCallback(async (silent = false) => {
        if (!silent) setRefreshing(true);

        try {
            // Fetch dashboard stats from new endpoint
            const statsRes = await axios.get(`${serverUrl}/api/admin/data/stats`);
            if (statsRes.data) {
                setStats(prev => ({
                    ...prev,
                    ...statsRes.data
                }));
            }

            // Fetch course stats
            const coursesRes = await axios.get(`${serverUrl}/api/admin/data/courses/stats`);
            if (coursesRes.data?.courses) {
                setCourses(coursesRes.data.courses);
            }

            // Fetch recent users
            const usersRes = await axios.get(`${serverUrl}/api/admin/data/users/recent?limit=10&hours=168`);
            if (usersRes.data?.users) {
                setRecentUsers(usersRes.data.users);
            }

            // Fetch activity feed
            const activityRes = await axios.get(`${serverUrl}/api/admin/data/activity?limit=15`);
            if (activityRes.data?.activities) {
                setActivityFeed(activityRes.data.activities);
            }

            // Fetch feedbacks
            try {
                const feedbackRes = await axios.get(`${serverUrl}/api/feedback/all`);
                if (feedbackRes.data) {
                    setFeedbacks(feedbackRes.data);
                    setStats(prev => ({
                        ...prev,
                        feedbackCount: feedbackRes.data.filter(f => f.type === 'feedback').length,
                        issueCount: feedbackRes.data.filter(f => f.type === 'issue').length
                    }));
                }
            } catch (err) {
                console.log('Feedback fetch failed:', err.message);
            }

            // Fetch doubt sessions
            try {
                const doubtRes = await axios.get(`${serverUrl}/api/doubt-session/all`);
                if (doubtRes.data) {
                    setDoubtSessions(doubtRes.data);
                }
            } catch (err) {
                console.log('Doubt sessions fetch failed:', err.message);
            }

            setLastUpdated(new Date());

        } catch (error) {
            console.error('Fetch error:', error);
            if (!silent) {
                toast.error('Failed to fetch dashboard data');
            }
        }

        setLoading(false);
        setRefreshing(false);
    }, []);

    const handleRefresh = () => {
        fetchAllData();
        toast.success('Dashboard refreshed!');
    };

    const handleLogout = () => {
        localStorage.removeItem('adminToken');
        localStorage.removeItem('adminData');
        toast.success('Logged out successfully');
        navigate('/admin/login');
    };

    const formatTimeAgo = (date) => {
        const seconds = Math.floor((new Date() - new Date(date)) / 1000);
        if (seconds < 60) return `${seconds}s ago`;
        const minutes = Math.floor(seconds / 60);
        if (minutes < 60) return `${minutes}m ago`;
        const hours = Math.floor(minutes / 60);
        if (hours < 24) return `${hours}h ago`;
        const days = Math.floor(hours / 24);
        return `${days}d ago`;
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    const revenueData = courses.slice(0, 8).map(course => ({
        name: course.title?.slice(0, 12) + (course.title?.length > 12 ? '...' : '') || 'Course',
        revenue: course.revenue || 0,
        students: course.enrollmentCount || 0,
        price: course.price || 0
    }));

    const pieData = [
        { name: 'Feedback', value: stats.feedbackCount, color: '#3B82F6' },
        { name: 'Issues', value: stats.issueCount, color: '#F59E0B' }
    ];

    const userDistribution = [
        { name: 'Students', value: stats.totalStudents, color: '#10B981' },
        { name: 'Educators', value: stats.totalEducators, color: '#6366F1' }
    ];

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <ClipLoader size={50} color="black" />
                    <p className="mt-4 text-gray-600">Loading dashboard...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-100">
            {/* Header */}
            <div className="bg-black text-white py-6 px-6 sticky top-0 z-50">
                <div className="max-w-7xl mx-auto flex items-center justify-between">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <ArrowBackIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Admin Dashboard</h1>
                            <p className="text-gray-400 text-sm">
                                Welcome, {adminData?.name || 'Admin'} •
                                <span className="ml-2 text-green-400">● Live</span>
                            </p>
                        </div>
                    </div>
                    <div className="flex items-center gap-3">
                        {/* Auto-refresh toggle */}
                        <label className="flex items-center gap-2 cursor-pointer">
                            <span className="text-sm text-gray-400">Auto-refresh</span>
                            <div className="relative">
                                <input
                                    type="checkbox"
                                    checked={autoRefresh}
                                    onChange={(e) => setAutoRefresh(e.target.checked)}
                                    className="sr-only"
                                />
                                <div className={`w-10 h-5 rounded-full transition-colors ${autoRefresh ? 'bg-green-500' : 'bg-gray-600'}`}>
                                    <div className={`w-4 h-4 bg-white rounded-full m-0.5 transition-transform ${autoRefresh ? 'translate-x-5' : ''}`}></div>
                                </div>
                            </div>
                        </label>
                        <div className="text-right hidden md:block">
                            <p className="text-xs text-gray-400">Last updated</p>
                            <p className="text-sm">{formatTimeAgo(lastUpdated)}</p>
                        </div>
                        <button
                            onClick={() => navigate('/admin/voice-monitor')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <MicIcon />
                            <span className="hidden md:inline">Voice Monitor</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/doubt-sessions')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <MenuBookIcon />
                            <span className="hidden md:inline">Doubt Sessions</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/educator-approvals')}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <PersonAddOutlinedIcon />
                            <span className="hidden md:inline">Educator Approvals</span>
                        </button>
                        <button
                            onClick={() => navigate('/admin/feedback-manager')}
                            className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                        >
                            <ChatBubbleOutlineIcon className="w-4 h-4" />
                            <span className="hidden md:inline">Feedback</span>
                        </button>
                        <button
                            onClick={handleRefresh}
                            disabled={refreshing}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors disabled:opacity-50"
                            title="Refresh Data"
                        >
                            <SyncIcon className={`w-5 h-5 ${refreshing ? 'animate-spin' : ''}`} />
                        </button>
                        <button
                            onClick={handleLogout}
                            className="flex items-center gap-2 px-4 py-2 bg-gray-800 hover:bg-gray-700 text-white rounded-lg transition-colors"
                        >
                            <LogoutIcon className="w-4 h-4" />
                            <span className="hidden md:inline">Logout</span>
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Main Stats Cards */}
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mb-6">
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center">
                                <SchoolOutlinedIcon className="w-6 h-6 text-green-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalStudents}</p>
                                <p className="text-xs text-gray-500">Total Students</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center">
                                <SchoolIcon className="w-6 h-6 text-indigo-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalEducators}</p>
                                <p className="text-xs text-gray-500">Teachers</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                                <BookIcon className="w-6 h-6 text-purple-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalCourses}</p>
                                <p className="text-xs text-gray-500">Courses</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-yellow-100 rounded-lg flex items-center justify-center">
                                <PaymentsIcon className="w-6 h-6 text-yellow-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">₹{stats.totalRevenue?.toLocaleString() || 0}</p>
                                <p className="text-xs text-gray-500">Revenue</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                                <SchoolIcon className="w-6 h-6 text-blue-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.totalEnrollments}</p>
                                <p className="text-xs text-gray-500">Enrollments</p>
                            </div>
                        </div>
                    </div>
                    <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-5 hover:shadow-md transition-shadow">
                        <div className="flex items-center gap-3">
                            <div className="w-12 h-12 bg-emerald-100 rounded-lg flex items-center justify-center">
                                <PersonAddIcon className="w-6 h-6 text-emerald-600" />
                            </div>
                            <div>
                                <p className="text-2xl font-bold text-gray-900">{stats.newUsersToday}</p>
                                <p className="text-xs text-gray-500">New Today</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Today's Stats Banner */}
                <div className="bg-gradient-to-r from-black to-gray-800 text-white rounded-xl p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold mb-1">Today's Activity</h2>
                            <p className="text-gray-400 text-sm">Real-time platform statistics</p>
                        </div>
                        <div className="flex gap-8">
                            <div className="text-center">
                                <p className="text-3xl font-bold text-green-400">{stats.newStudentsToday}</p>
                                <p className="text-xs text-gray-400">New Students</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-indigo-400">{stats.newEducatorsToday}</p>
                                <p className="text-xs text-gray-400">New Teachers</p>
                            </div>
                            <div className="text-center">
                                <p className="text-3xl font-bold text-yellow-400">{stats.newUsersThisWeek}</p>
                                <p className="text-xs text-gray-400">This Week</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Main Content Grid */}
                <div className="grid lg:grid-cols-3 gap-6 mb-6">
                    {/* Activity Feed */}
                    <div className="lg:col-span-1 bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                        <div className="flex items-center justify-between mb-4">
                            <h2 className="text-lg font-semibold">Live Activity Feed</h2>
                            <span className="flex items-center gap-1 text-xs text-green-500">
                                <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
                                Live
                            </span>
                        </div>
                        <div className="space-y-3 max-h-96 overflow-y-auto">
                            {activityFeed.length === 0 ? (
                                <p className="text-gray-500 text-center py-8">No recent activity</p>
                            ) : (
                                activityFeed.map((activity, index) => (
                                    <div key={index} className="flex items-start gap-3 p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors">
                                        <div className={`w-8 h-8 rounded-full flex items-center justify-center text-white text-xs font-bold ${activity.type === 'enrollment' ? 'bg-blue-500' : 'bg-green-500'
                                            }`}>
                                            {activity.user?.name?.charAt(0)?.toUpperCase() || '?'}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm text-gray-800 truncate">{activity.message}</p>
                                            <div className="flex items-center gap-2 mt-1">
                                                <span className="text-xs text-gray-400">
                                                    <AccessTimeIcon className="inline w-3 h-3 mr-1" />
                                                    {formatTimeAgo(activity.timestamp)}
                                                </span>
                                                {activity.revenue > 0 && (
                                                    <span className="text-xs text-green-600 font-medium">
                                                        +₹{activity.revenue}
                                                    </span>
                                                )}
                                            </div>
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </div>

                    {/* Charts */}
                    <div className="lg:col-span-2 grid gap-6">
                        {/* Revenue Chart */}
                        <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                            <h2 className="text-lg font-semibold mb-4">Revenue by Course</h2>
                            <ResponsiveContainer width="100%" height={250}>
                                <BarChart data={revenueData}>
                                    <CartesianGrid strokeDasharray="3 3" />
                                    <XAxis dataKey="name" tick={{ fontSize: 10 }} />
                                    <YAxis />
                                    <Tooltip formatter={(value) => `₹${value.toLocaleString()}`} />
                                    <Bar dataKey="revenue" fill="#000" radius={[5, 5, 0, 0]} />
                                </BarChart>
                            </ResponsiveContainer>
                        </div>

                        {/* Pie Charts Row */}
                        <div className="grid md:grid-cols-2 gap-6">
                            {/* User Distribution */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">User Distribution</h2>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={userDistribution}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
                                            paddingAngle={5}
                                            dataKey="value"
                                            label={({ name, value }) => `${name}: ${value}`}
                                        >
                                            {userDistribution.map((entry, index) => (
                                                <Cell key={`cell-${index}`} fill={entry.color} />
                                            ))}
                                        </Pie>
                                        <Tooltip />
                                    </PieChart>
                                </ResponsiveContainer>
                            </div>

                            {/* Feedback vs Issues */}
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                                <h2 className="text-lg font-semibold mb-4">Feedback vs Issues</h2>
                                <ResponsiveContainer width="100%" height={200}>
                                    <PieChart>
                                        <Pie
                                            data={pieData}
                                            cx="50%"
                                            cy="50%"
                                            innerRadius={50}
                                            outerRadius={80}
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
                </div>

                {/* Recent Users Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Recent Users</h2>
                        <span className="text-sm text-gray-500">Last 7 days</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">User</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Email</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Role</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Joined</th>
                                </tr>
                            </thead>
                            <tbody>
                                {recentUsers.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-500">
                                            No recent users
                                        </td>
                                    </tr>
                                ) : (
                                    recentUsers.map(user => (
                                        <tr key={user._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="flex items-center gap-3">
                                                    <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center text-gray-600 font-medium">
                                                        {user.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <span className="font-medium text-gray-900">{user.name}</span>
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">{user.email}</td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${user.role === 'educator'
                                                    ? 'bg-indigo-100 text-indigo-700'
                                                    : 'bg-green-100 text-green-700'
                                                    }`}>
                                                    {user.role}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">
                                                {formatDate(user.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Course Revenue Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold">Course Revenue Details</h2>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Creator</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Price</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Enrolled</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Revenue</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {courses.length === 0 ? (
                                    <tr>
                                        <td colSpan={6} className="py-8 text-center text-gray-500">
                                            No courses yet
                                        </td>
                                    </tr>
                                ) : (
                                    courses.map(course => (
                                        <tr key={course._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-gray-900">{course.title}</div>
                                                <div className="text-xs text-gray-500">{course.category}</div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {course.creator?.name || 'Unknown'}
                                            </td>
                                            <td className="py-3 px-4 text-gray-700">₹{course.price || 0}</td>
                                            <td className="py-3 px-4">
                                                <span className="font-medium text-blue-600">
                                                    {course.enrollmentCount || 0}
                                                </span>
                                            </td>
                                            <td className="py-3 px-4 font-semibold text-green-600">
                                                ₹{(course.revenue || 0).toLocaleString()}
                                            </td>
                                            <td className="py-3 px-4">
                                                <span className={`px-2 py-1 rounded-full text-xs font-medium ${course.isPublished
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-yellow-100 text-yellow-700'
                                                    }`}>
                                                    {course.isPublished ? 'Published' : 'Draft'}
                                                </span>
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Doubt Sessions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between mb-4">
                        <h2 className="text-lg font-semibold flex items-center gap-2">
                            <span>📚</span> Active Doubt Sessions
                        </h2>
                        <span className="text-sm text-gray-500">{doubtSessions.length} sessions</span>
                    </div>
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="border-b border-gray-200">
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Meeting Link</th>
                                    <th className="text-left py-3 px-4 font-medium text-gray-600">Created</th>
                                </tr>
                            </thead>
                            <tbody>
                                {doubtSessions.length === 0 ? (
                                    <tr>
                                        <td colSpan={4} className="py-8 text-center text-gray-500">
                                            No doubt sessions created yet
                                        </td>
                                    </tr>
                                ) : (
                                    doubtSessions.map(session => (
                                        <tr key={session._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4">
                                                <div className="font-medium text-gray-900">
                                                    {session.course?.title || 'Unknown Course'}
                                                </div>
                                            </td>
                                            <td className="py-3 px-4 text-gray-600">
                                                {session.course?.creator?.name || 'Unknown Teacher'}
                                            </td>
                                            <td className="py-3 px-4">
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="text-blue-600 hover:underline truncate block max-w-xs"
                                                >
                                                    {session.meetingLink}
                                                </a>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">
                                                {formatDate(session.createdAt)}
                                            </td>
                                        </tr>
                                    ))
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="grid md:grid-cols-3 gap-6">
                    <div
                        onClick={() => navigate('/admin/educator-approvals')}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow border-l-4 border-l-yellow-500"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-yellow-100 rounded-xl flex items-center justify-center">
                                <PersonAddOutlinedIcon className="w-7 h-7 text-yellow-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">Educator Approvals</h3>
                                <p className="text-gray-500 text-sm">
                                    Review pending educator requests
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/admin/feedback-manager')}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-blue-100 rounded-xl flex items-center justify-center">
                                <ChatBubbleOutlineIcon className="w-7 h-7 text-blue-600" />
                            </div>
                            <div>
                                <h3 className="text-lg font-semibold text-gray-900">View Feedback & Issues</h3>
                                <p className="text-gray-500 text-sm">
                                    {stats.feedbackCount + stats.issueCount} submissions to review
                                </p>
                            </div>
                        </div>
                    </div>
                    <div
                        onClick={() => navigate('/contact')}
                        className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 cursor-pointer hover:shadow-md transition-shadow"
                    >
                        <div className="flex items-center gap-4">
                            <div className="w-14 h-14 bg-green-100 rounded-xl flex items-center justify-center">
                                <GroupIcon className="w-7 h-7 text-green-600" />
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
