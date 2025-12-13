import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import { FaArrowLeft, FaSync, FaVideo, FaExternalLinkAlt } from 'react-icons/fa';

const AdminDoubtSessions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doubtSessions, setDoubtSessions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);

    useEffect(() => {
        // Check admin authentication
        const token = localStorage.getItem('adminToken');
        if (!token) {
            navigate('/admin/login');
            return;
        }
        fetchDoubtSessions();
    }, [navigate]);

    const fetchDoubtSessions = async () => {
        setRefreshing(true);
        try {
            const response = await axios.get(`${serverUrl}/api/doubt-session/all`);
            if (response.data) {
                setDoubtSessions(response.data);
            }
        } catch (error) {
            console.error('Error fetching doubt sessions:', error);
            toast.error('Failed to fetch doubt sessions');
        }
        setLoading(false);
        setRefreshing(false);
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-100 flex items-center justify-center">
                <div className="text-center">
                    <ClipLoader size={50} color="black" />
                    <p className="mt-4 text-gray-600">Loading doubt sessions...</p>
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
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold flex items-center gap-2">
                                <FaVideo /> Doubt Sessions
                            </h1>
                            <p className="text-gray-400 text-sm">
                                Manage all doubt solving sessions
                            </p>
                        </div>
                    </div>
                    <button
                        onClick={fetchDoubtSessions}
                        disabled={refreshing}
                        className="flex items-center gap-2 px-4 py-2 bg-white/10 hover:bg-white/20 rounded-lg transition-colors"
                    >
                        <FaSync className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats Card */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 mb-6">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-3xl font-bold text-gray-900">{doubtSessions.length}</h2>
                            <p className="text-gray-500">Total Doubt Sessions</p>
                        </div>
                        <div className="w-16 h-16 bg-purple-100 rounded-2xl flex items-center justify-center">
                            <FaVideo className="w-8 h-8 text-purple-600" />
                        </div>
                    </div>
                </div>

                {/* Doubt Sessions Table */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
                    <h2 className="text-lg font-semibold mb-4">All Doubt Sessions</h2>

                    {doubtSessions.length === 0 ? (
                        <div className="text-center py-12">
                            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                <FaVideo className="w-10 h-10 text-gray-400" />
                            </div>
                            <h3 className="text-lg font-medium text-gray-900 mb-2">No Doubt Sessions Yet</h3>
                            <p className="text-gray-500 mb-4">
                                Teachers haven't created any doubt solving sessions yet.
                            </p>
                            <p className="text-sm text-gray-400">
                                Doubt sessions are created by teachers for their courses to help students.
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="w-full">
                                <thead>
                                    <tr className="border-b border-gray-200">
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">#</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Course</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Teacher</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Meeting Link</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Created At</th>
                                        <th className="text-left py-3 px-4 font-medium text-gray-600">Action</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {doubtSessions.map((session, index) => (
                                        <tr key={session._id} className="border-b border-gray-100 hover:bg-gray-50">
                                            <td className="py-3 px-4 text-gray-500">{index + 1}</td>
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
                                                    {session.meetingLink?.slice(0, 40)}...
                                                </a>
                                            </td>
                                            <td className="py-3 px-4 text-gray-500 text-sm">
                                                {formatDate(session.createdAt)}
                                            </td>
                                            <td className="py-3 px-4">
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="flex items-center gap-1 text-sm bg-blue-500 text-white px-3 py-1 rounded-lg hover:bg-blue-600 transition-colors w-fit"
                                                >
                                                    <FaExternalLinkAlt className="w-3 h-3" />
                                                    Join
                                                </a>
                                            </td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminDoubtSessions;
