import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import {
    FaClock,
    FaEye,
    FaCheck,
    FaCommentDots,
    FaBug,
    FaTrash
} from 'react-icons/fa';

const UserFeedbackList = ({ userEmail }) => {
    const [feedbacks, setFeedbacks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [deleting, setDeleting] = useState(null);

    useEffect(() => {
        if (userEmail) {
            fetchUserFeedback();
        }
    }, [userEmail]);

    const fetchUserFeedback = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/feedback/user/${encodeURIComponent(userEmail)}`);
            setFeedbacks(response.data);
        } catch (error) {
            console.error('Fetch error:', error);
        }
        setLoading(false);
    };

    const deleteFeedback = async (id) => {
        if (!window.confirm('Are you sure you want to delete this?')) return;

        setDeleting(id);
        try {
            await axios.delete(`${serverUrl}/api/feedback/${id}`);
            setFeedbacks(feedbacks.filter(f => f._id !== id));
            toast.success('Deleted successfully');
        } catch (error) {
            toast.error('Failed to delete');
        }
        setDeleting(null);
    };

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
            month: 'short',
            day: 'numeric',
            year: 'numeric'
        });
    };

    if (loading) {
        return (
            <div className="flex justify-center py-8">
                <ClipLoader size={30} color="black" />
            </div>
        );
    }

    if (feedbacks.length === 0) {
        return (
            <div className="text-center py-8 text-gray-500">
                <FaCommentDots className="w-8 h-8 mx-auto mb-2 text-gray-300" />
                <p>No feedback or issues submitted yet</p>
            </div>
        );
    }

    return (
        <div className="space-y-3">
            {feedbacks.map(feedback => (
                <div key={feedback._id} className="bg-gray-50 rounded-lg p-4 border border-gray-200">
                    <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                            {feedback.type === 'feedback'
                                ? <FaCommentDots className="w-4 h-4 text-blue-500" />
                                : <FaBug className="w-4 h-4 text-orange-500" />
                            }
                            <span className="font-medium text-gray-900">{feedback.subject}</span>
                        </div>
                        <div className="flex items-center gap-2">
                            <span className={`flex items-center gap-1 px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(feedback.status)}`}>
                                {getStatusIcon(feedback.status)}
                                {feedback.status}
                            </span>
                            <button
                                onClick={() => deleteFeedback(feedback._id)}
                                disabled={deleting === feedback._id}
                                className="p-1 text-red-500 hover:bg-red-50 rounded transition-colors disabled:opacity-50"
                            >
                                {deleting === feedback._id
                                    ? <ClipLoader size={14} color="red" />
                                    : <FaTrash className="w-3 h-3" />
                                }
                            </button>
                        </div>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-2 mb-2">{feedback.message}</p>
                    <div className="flex items-center justify-between text-xs text-gray-400">
                        <span className="capitalize">{feedback.type}</span>
                        <span>{formatDate(feedback.createdAt)}</span>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default UserFeedbackList;
