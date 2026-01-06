import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import {
    FaCommentDots,
    FaBug,
    FaArrowLeft,
    FaCheck,
    FaEye,
    FaClock,
    FaEnvelope
} from 'react-icons/fa';

const FeedbackManager = () => {
    const navigate = useNavigate();
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('all'); // 'all', 'feedback', 'issue'
    const [statusFilter, setStatusFilter] = useState('all'); // 'all', 'pending', 'reviewed', 'resolved'
    const [selectedFeedback, setSelectedFeedback] = useState(null);
    const [updating, setUpdating] = useState(false);

    useEffect(() => {
        fetchFeedbacks();
    }, []);

    const fetchFeedbacks = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/feedback/all`);
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
            toast.error('Failed to fetch feedback');
        }
        setLoading(false);
    };

    const updateStatus = async (id, newStatus) => {
        setUpdating(true);
        try {
            await axios.patch(`${serverUrl}/api/feedback/status/${id}`, { status: newStatus });
            setFeedbacks(feedbacks.map(f => f._id === id ? { ...f, status: newStatus } : f));
            if (selectedFeedback?._id === id) {
                setSelectedFeedback({ ...selectedFeedback, status: newStatus });
            }
            toast.success('Status updated');
        } catch (error) {
            toast.error('Failed to update status');
        }
        setUpdating(false);
    };

    const filteredFeedbacks = feedbacks.filter(f => {
        const typeMatch = filter === 'all' || f.type === filter;
        const statusMatch = statusFilter === 'all' || f.status === statusFilter;
        return typeMatch && statusMatch;
    });

    const getStatusColor = (status) => {
        switch (status) {
            case 'pending': return 'bg-yellow-100 text-yellow-800';
            case 'reviewed': return 'bg-blue-100 text-blue-800';
            case 'resolved': return 'bg-green-100 text-green-800';
            default: return 'bg-gray-100 text-gray-800';
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'pending': return <FaClock className="w-3 h-3" />;
            case 'reviewed': return <FaEye className="w-3 h-3" />;
            case 'resolved': return <FaCheck className="w-3 h-3" />;
            default: return null;
        }
    };

    const formatDate = (date) => {
        return new Date(date).toLocaleDateString('en-US', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
    };

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
                            onClick={() => navigate('/dashboard')}
                            className="p-2 rounded-lg transition-colors"
                        >
                            <FaArrowLeft className="w-5 h-5" />
                        </button>
                        <div>
                            <h1 className="text-2xl font-bold">Feedback Manager</h1>
                            <p className="text-gray-400 text-sm">View and manage user feedback & issues</p>
                        </div>
                    </div>
                    <div className="text-right">
                        <p className="text-2xl font-bold">{feedbacks.length}</p>
                        <p className="text-gray-400 text-sm">Total Submissions</p>
                    </div>
                </div>
            </div>

            <div className="max-w-7xl mx-auto p-6">
                {/* Filters */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-4 mb-6">
                    <div className="flex flex-wrap gap-4 items-center justify-between">
                        <div className="flex gap-2">
                            <span className="text-gray-600 text-sm font-medium self-center">Type:</span>
                            {['all', 'feedback', 'issue'].map(type => (
                                <button
                                    key={type}
                                    onClick={() => setFilter(type)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${filter === type
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {type === 'all' ? 'All' : type === 'feedback' ? 'Feedback' : 'Issues'}
                                </button>
                            ))}
                        </div>
                        <div className="flex gap-2">
                            <span className="text-gray-600 text-sm font-medium self-center">Status:</span>
                            {['all', 'pending', 'reviewed', 'resolved'].map(status => (
                                <button
                                    key={status}
                                    onClick={() => setStatusFilter(status)}
                                    className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${statusFilter === status
                                        ? 'bg-black text-white'
                                        : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                        }`}
                                >
                                    {status}
                                </button>
                            ))}
                        </div>
                    </div>
                </div>

                {/* Main Content */}
                <div className="grid lg:grid-cols-3 gap-6">
                    {/* List */}
                    <div className="lg:col-span-2">
                        {filteredFeedbacks.length === 0 ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaCommentDots className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">No submissions found</h3>
                                <p className="text-gray-500">Try adjusting your filters</p>
                            </div>
                        ) : (
                            <div className="space-y-4">
                                {filteredFeedbacks.map(feedback => (
                                    <div
                                        key={feedback._id}
                                        onClick={() => setSelectedFeedback(feedback)}
                                        className={`bg-white rounded-xl shadow-sm border p-5 cursor-pointer transition-all hover:shadow-md ${selectedFeedback?._id === feedback._id
                                            ? 'border-black ring-2 ring-black/10'
                                            : 'border-gray-200'
                                            }`}
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${feedback.type === 'feedback' ? 'bg-blue-100' : 'bg-orange-100'
                                                    }`}>
                                                    {feedback.type === 'feedback'
                                                        ? <FaCommentDots className="w-5 h-5 text-blue-600" />
                                                        : <FaBug className="w-5 h-5 text-orange-600" />
                                                    }
                                                </div>
                                                <div>
                                                    <h3 className="font-semibold text-gray-900">{feedback.subject}</h3>
                                                    <p className="text-sm text-gray-500">{feedback.name}</p>
                                                </div>
                                            </div>
                                            <span className={`flex items-center gap-1 px-3 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                                {getStatusIcon(feedback.status)}
                                                {feedback.status}
                                            </span>
                                        </div>
                                        <p className="text-gray-600 text-sm line-clamp-2 mb-3">{feedback.message}</p>
                                        <div className="flex items-center justify-between text-xs text-gray-400">
                                            <span>{formatDate(feedback.createdAt)}</span>
                                            <span className="flex items-center gap-1">
                                                <FaEnvelope className="w-3 h-3" />
                                                {feedback.email}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Detail Panel */}
                    <div className="lg:col-span-1">
                        {selectedFeedback ? (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 sticky top-6">
                                <div className="flex items-center gap-3 mb-6">
                                    <div className={`w-12 h-12 rounded-lg flex items-center justify-center ${selectedFeedback.type === 'feedback' ? 'bg-blue-100' : 'bg-orange-100'
                                        }`}>
                                        {selectedFeedback.type === 'feedback'
                                            ? <FaCommentDots className="w-6 h-6 text-blue-600" />
                                            : <FaBug className="w-6 h-6 text-orange-600" />
                                        }
                                    </div>
                                    <div>
                                        <span className="text-xs font-medium text-gray-500 uppercase">
                                            {selectedFeedback.type}
                                        </span>
                                        <h2 className="font-bold text-gray-900">{selectedFeedback.subject}</h2>
                                    </div>
                                </div>

                                <div className="space-y-4 mb-6">
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">From</label>
                                        <p className="text-gray-900 font-medium">{selectedFeedback.name}</p>
                                        <p className="text-gray-500 text-sm">{selectedFeedback.email}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Message</label>
                                        <p className="text-gray-700 whitespace-pre-wrap">{selectedFeedback.message}</p>
                                    </div>
                                    <div>
                                        <label className="text-xs font-medium text-gray-500 uppercase">Submitted</label>
                                        <p className="text-gray-700">{formatDate(selectedFeedback.createdAt)}</p>
                                    </div>
                                </div>

                                <div>
                                    <label className="text-xs font-medium text-gray-500 uppercase mb-2 block">Update Status</label>
                                    <div className="flex gap-2">
                                        {['pending', 'reviewed', 'resolved'].map(status => (
                                            <button
                                                key={status}
                                                onClick={() => updateStatus(selectedFeedback._id, status)}
                                                disabled={updating || selectedFeedback.status === status}
                                                className={`flex-1 py-2 rounded-lg text-sm font-medium transition-colors capitalize ${selectedFeedback.status === status
                                                    ? 'bg-black text-white'
                                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                                    } disabled:opacity-50`}
                                            >
                                                {status}
                                            </button>
                                        ))}
                                    </div>
                                </div>

                                <a
                                    href={`mailto:${selectedFeedback.email}?subject=Re: ${selectedFeedback.subject}`}
                                    className="mt-4 w-full flex items-center justify-center gap-2 bg-black text-white py-3 rounded-lg font-medium transition-colors"
                                >
                                    <FaEnvelope className="w-4 h-4" />
                                    Reply via Email
                                </a>
                            </div>
                        ) : (
                            <div className="bg-white rounded-xl shadow-sm border border-gray-200 p-12 text-center">
                                <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <FaEye className="w-8 h-8 text-gray-400" />
                                </div>
                                <h3 className="text-lg font-medium text-gray-800 mb-2">Select a submission</h3>
                                <p className="text-gray-500 text-sm">Click on any feedback or issue to view details</p>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default FeedbackManager;
