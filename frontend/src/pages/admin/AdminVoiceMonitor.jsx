import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import {
    FaArrowLeft,
    FaSync,
    FaMicrophone,
    FaPhone,
    FaStopCircle,
    FaClock
} from 'react-icons/fa';

const AdminVoiceMonitor = () => {
    const navigate = useNavigate();
    const [activeRooms, setActiveRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [endingRoomId, setEndingRoomId] = useState(null);
    const [hoveredRoom, setHoveredRoom] = useState(null);

    useEffect(() => {
        fetchActiveRooms();
        const interval = setInterval(fetchActiveRooms, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            const response = await axios.get(`${serverUrl}/api/voice-room/admin/active`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setActiveRooms(response.data.rooms || []);
        } catch (err) {
            console.error("Fetch active rooms error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to end this voice room?")) return;

        try {
            setEndingRoomId(roomId);
            const adminToken = localStorage.getItem('adminToken');
            await axios.put(
                `${serverUrl}/api/voice-room/admin/${roomId}/end`,
                {},
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success("Voice room ended successfully");
            fetchActiveRooms();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to end room");
        } finally {
            setEndingRoomId(null);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const totalCallTime = activeRooms.reduce((acc, room) => acc + (room.currentDuration || 0), 0);

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
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="flex items-center gap-3">
                                <FaMicrophone className="w-6 h-6" />
                                Voice Room Monitor
                            </h1>
                            <p>Monitor and manage all active voice rooms</p>
                        </div>
                    </div>
                    <div className="flex items-center gap-4">
                        <div className="flex items-center gap-2 text-green-400 text-sm">
                            <span className="w-2 h-2 bg-green-400 rounded-full animate-pulse" />
                            Auto-refreshing
                        </div>
                        <button
                            onClick={fetchActiveRooms}
                            className="admin-btn admin-btn-secondary flex items-center gap-2"
                            style={{ background: 'rgba(255,255,255,0.1)', border: 'none', color: 'white' }}
                        >
                            <FaSync className="w-4 h-4" />
                            Refresh
                        </button>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Stats */}
                <div className="grid md:grid-cols-2 gap-4 mb-6">
                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-dark">
                                <FaMicrophone className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{activeRooms.length}</p>
                                <p className="admin-stat-label">Active Rooms</p>
                            </div>
                        </div>
                    </div>
                    <div className="admin-stat-card">
                        <div className="flex items-center gap-3">
                            <div className="admin-icon-box admin-icon-box-light">
                                <FaClock className="w-5 h-5" />
                            </div>
                            <div>
                                <p className="admin-stat-value">{formatDuration(totalCallTime)}</p>
                                <p className="admin-stat-label">Total Call Time</p>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Active Rooms Section */}
                <div className="admin-card">
                    <div className="flex items-center justify-between mb-6">
                        <h2 className="text-lg font-bold flex items-center gap-2">
                            <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                            Active Voice Rooms
                        </h2>
                    </div>

                    {loading ? (
                        <div className="flex justify-center items-center h-40">
                            <ClipLoader size={40} color="#000" />
                        </div>
                    ) : activeRooms.length === 0 ? (
                        <div className="text-center py-16 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <div className="admin-icon-box admin-icon-box-light w-20 h-20 mx-auto mb-4">
                                <FaMicrophone className="w-10 h-10" />
                            </div>
                            <h3 className="text-xl font-bold text-gray-900 mb-2">No Active Voice Rooms</h3>
                            <p className="text-gray-500 max-w-md mx-auto">
                                Voice rooms will appear here when students and educators start calls
                            </p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            {activeRooms.map(room => (
                                <div
                                    key={room._id}
                                    className="admin-list-item flex-col items-start gap-4 cursor-default"
                                    onMouseEnter={() => setHoveredRoom(room._id)}
                                    onMouseLeave={() => setHoveredRoom(null)}
                                    style={{
                                        transform: hoveredRoom === room._id ? 'scale(1.01)' : 'scale(1)',
                                        boxShadow: hoveredRoom === room._id ? '0 10px 30px rgba(0,0,0,0.1)' : 'none'
                                    }}
                                >
                                    {/* Room Header */}
                                    <div className="flex items-center justify-between w-full">
                                        <div className="flex items-center gap-3">
                                            <span className="admin-badge admin-badge-error flex items-center gap-1">
                                                <span className="w-2 h-2 bg-red-500 rounded-full animate-pulse" />
                                                LIVE
                                            </span>
                                            <span className="font-mono font-bold text-lg">
                                                {formatDuration(room.currentDuration)}
                                            </span>
                                        </div>
                                        <button
                                            onClick={() => handleEndRoom(room.roomId)}
                                            disabled={endingRoomId === room.roomId}
                                            className="admin-btn admin-btn-primary py-2 px-4 flex items-center gap-2"
                                            style={{ background: '#000000' }}
                                        >
                                            {endingRoomId === room.roomId ? (
                                                <ClipLoader size={16} color="white" />
                                            ) : (
                                                <>
                                                    <FaStopCircle className="w-4 h-4" />
                                                    End Room
                                                </>
                                            )}
                                        </button>
                                    </div>

                                    {/* Participants */}
                                    <div className="flex items-center justify-center gap-6 w-full py-4">
                                        {/* Student */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={room.student?.photoUrl || '/default-avatar.png'}
                                                alt={room.student?.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-black"
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Student</p>
                                                <p className="font-semibold">{room.student?.name}</p>
                                            </div>
                                        </div>

                                        {/* Call Icon */}
                                        <div className="admin-icon-box admin-icon-box-dark w-12 h-12">
                                            <FaPhone className="w-5 h-5" />
                                        </div>

                                        {/* Educator */}
                                        <div className="flex items-center gap-3">
                                            <img
                                                src={room.educator?.photoUrl || '/default-avatar.png'}
                                                alt={room.educator?.name}
                                                className="w-12 h-12 rounded-full object-cover border-2 border-black"
                                            />
                                            <div>
                                                <p className="text-xs text-gray-500 uppercase tracking-wide">Educator</p>
                                                <p className="font-semibold">{room.educator?.name}</p>
                                            </div>
                                        </div>
                                    </div>

                                    {/* Footer */}
                                    <div className="flex items-center justify-between w-full pt-4 border-t border-gray-100">
                                        <span className="text-sm text-gray-500 flex items-center gap-2">
                                            <FaClock className="w-3 h-3" />
                                            Started at {formatTime(room.startTime)}
                                        </span>
                                        <span className="text-xs text-gray-400">
                                            Room ID: {room.roomId}
                                        </span>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default AdminVoiceMonitor;
