import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import { serverUrl } from '../../App.jsx';
import LinkIcon from '@mui/icons-material/Link';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

const CreateDoubtSession = () => {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const [meetingLink, setMeetingLink] = useState('');
    const [loading, setLoading] = useState(false);
    const { token } = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!meetingLink.trim()) {
            toast.error('Please enter a meeting link');
            return;
        }

        setLoading(true);
        try {
            await axios.post(`${serverUrl}/api/doubt-session/doubt-session`, {
                courseId,
                meetingLink
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            toast.success('Doubt session created successfully!');
            setMeetingLink('');
            navigate(-1); // Go back to previous page
        } catch (error) {
            console.log(error);
            toast.error(error.response?.data?.message || 'Failed to create doubt session');
        }
        setLoading(false);
    };

    return (
        <div className="min-h-screen bg-gray-100 py-12 px-4">
            <div className="max-w-xl mx-auto">
                <button
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-600 hover:text-black mb-6 transition-colors"
                >
                    <ArrowBackIcon /> Back
                </button>

                <div className="bg-white rounded-2xl shadow-lg p-8">
                    <h1 className="text-2xl font-bold mb-2">Create Doubt Session</h1>
                    <p className="text-gray-500 mb-6">Enter the meeting link for students to join</p>

                    <form onSubmit={handleSubmit}>
                        <div className="mb-6">
                            <label className="block text-gray-700 font-medium mb-2">
                                Meeting Link
                            </label>
                            <div className="relative">
                                <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                                    <LinkIcon className="text-gray-400" />
                                </div>
                                <input
                                    type="url"
                                    value={meetingLink}
                                    onChange={(e) => setMeetingLink(e.target.value)}
                                    className="w-full pl-12 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-black focus:border-transparent"
                                    placeholder="https://meet.google.com/abc-xyz-123"
                                    required
                                />
                            </div>
                            <p className="text-sm text-gray-400 mt-2">
                                Paste your Google Meet, Zoom, or any video call link
                            </p>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-black text-white py-3 rounded-xl font-semibold hover:bg-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                        >
                            {loading ? 'Creating...' : 'Create Session'}
                        </button>
                    </form>
                </div>
            </div>
        </div>
    );
};

export default CreateDoubtSession;