import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';
import SyncIcon from '@mui/icons-material/Sync';
import VideoCameraBackIcon from '@mui/icons-material/VideoCameraBack';
import LaunchIcon from '@mui/icons-material/Launch';
import SearchIcon from '@mui/icons-material/Search';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';

const AdminDoubtSessions = () => {
    const navigate = useNavigate();
    const [loading, setLoading] = useState(true);
    const [doubtSessions, setDoubtSessions] = useState([]);
    const [refreshing, setRefreshing] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [hoveredRow, setHoveredRow] = useState(null);

    useEffect(() => {
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

    const filteredSessions = doubtSessions.filter(session =>
        session.course?.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        session.course?.creator?.name?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="text-center">
                    <ClipLoader size={50} color="black" />
                    <p className="mt-4 text-gray-600">Loading doubt sessions...</p>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Header */}
            <div className="admin-header">
                <div className="admin-header-content">
                    <div className="flex items-center gap-4">
                        <button
                            onClick={() => navigate('/admin/dashboard')}
                            className="p-2 hover:bg-white/10 rounded-lg transition-all duration-200 hover:scale-105"
                        >
                            <ArrowBackIcon className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="flex items-center gap-3">
                                <VideoCameraBackIcon className="w-6 h-6" />
                                Doubt Sessions
                            </h1>
                            <p>Manage all doubt solving sessions</p>
                        </div>
                    </div>
                    <button
                        onClick={fetchDoubtSessions}
                        disabled={refreshing}
                        className="admin-btn admin-btn-secondary flex items-center gap-2"
                        style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                    >
                        <SyncIcon className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
                        Refresh
                    </button>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats and Search */}
                <div className="grid md:grid-cols-3 gap-4 mb-6">
                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-dark">
                                <VideoCameraBackIcon className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{doubtSessions.length}</p>
                                <p className="admin-stat-label">Total Sessions</p>
                            </div>
                        </div>
                    </div>

                    <div className="md:col-span-2">
                        <div className="relative">
                            <SearchIcon className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />
                            <input
                                type="text"
                                placeholder="Search by course or teacher..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="admin-input pl-12"
                            />
                        </div>
                    </div>
                </div>

                {/* Sessions Table */}
                <div className="admin-card p-0 overflow-hidden">
                    <div className="p-6 border-b border-gray-100">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2 h-6 bg-black rounded-full" />
                            All Doubt Sessions
                        </h2>
                    </div>

                    {filteredSessions.length === 0 ? (
                        <div className="text-center py-16">
                            <div className="admin-icon-box admin-icon-box-light w-20 h-20 mx-auto mb-4">
                                <VideoCameraBackIcon className="w-10 h-10" />
                            </div>
                            <h3 className="text-lg font-bold text-gray-900 mb-2">
                                {searchTerm ? 'No matching sessions' : 'No Doubt Sessions Yet'}
                            </h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                {searchTerm
                                    ? 'Try adjusting your search terms'
                                    : 'Teachers haven\'t created any doubt solving sessions yet.'
                                }
                            </p>
                        </div>
                    ) : (
                        <div className="overflow-x-auto">
                            <table className="admin-table">
                                <thead>
                                    <tr>
                                        <th>#</th>
                                        <th>Course</th>
                                        <th>Teacher</th>
                                        <th>Created</th>
                                        <th>Actions</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    {filteredSessions.map((session, index) => (
                                        <tr
                                            key={session._id}
                                            onMouseEnter={() => setHoveredRow(session._id)}
                                            onMouseLeave={() => setHoveredRow(null)}
                                            style={{
                                                transform: hoveredRow === session._id ? 'scale(1.01)' : 'scale(1)',
                                                transition: 'all 0.2s ease',
                                                background: hoveredRow === session._id ? '#fafafa' : 'white'
                                            }}
                                        >
                                            <td className="text-gray-400 font-medium">{index + 1}</td>
                                            <td>
                                                <div className="font-semibold text-gray-900">
                                                    {session.course?.title || 'Unknown Course'}
                                                </div>
                                                <div className="text-xs text-gray-500">
                                                    {session.course?.category}
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2">
                                                    <div className="w-8 h-8 bg-black text-white rounded-full flex items-center justify-center text-sm font-bold">
                                                        {session.course?.creator?.name?.charAt(0)?.toUpperCase() || '?'}
                                                    </div>
                                                    <span>{session.course?.creator?.name || 'Unknown'}</span>
                                                </div>
                                            </td>
                                            <td>
                                                <div className="flex items-center gap-2 text-gray-500">
                                                    <CalendarTodayIcon className="w-3 h-3" />
                                                    {formatDate(session.createdAt)}
                                                </div>
                                            </td>
                                            <td>
                                                <a
                                                    href={session.meetingLink}
                                                    target="_blank"
                                                    rel="noopener noreferrer"
                                                    className="admin-btn admin-btn-primary py-2 px-4 text-sm inline-flex items-center gap-2 hover:-translate-y-0.5"
                                                >
                                                    <LaunchIcon className="w-3 h-3" />
                                                    Join Session
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
