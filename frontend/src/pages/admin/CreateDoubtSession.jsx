import React, { useState } from 'react';
import axios from 'axios';
import { useSelector } from 'react-redux';
import { useParams } from 'react-router-dom';

import { serverUrl } from '../../App.jsx';

const CreateDoubtSession = () => {
    const { courseId } = useParams();
    const [meetingLink, setMeetingLink] = useState('');
    const { token } = useSelector(state => state.user);

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post(`http://localhost:8000/api/doubt-session/doubt-session`, {
                courseId,
                meetingLink
            }, {
                headers: {
                    Authorization: `Bearer ${token}`
                }
            });
            alert('Doubt session created successfully');
        } catch (error) {
            console.log(error);
            alert('Failed to create doubt session');
        }
    };

    return (
        <div className="container mx-auto p-4">
            <h1 className="text-2xl font-bold mb-4">Create Doubt Session</h1>
            <form onSubmit={handleSubmit}>
                <div className="mb-4">
                    <label className="block text-gray-700">Meeting Link</label>
                    <input
                        type="text"
                        value={meetingLink}
                        onChange={(e) => setMeetingLink(e.target.value)}
                        className="w-full p-2 border border-gray-300 rounded"
                        required
                    />
                </div>

                <button type="submit" className="bg-blue-500 text-white p-2 rounded">
                    Create Session
                </button>
            </form>
        </div>
    );
};

export default CreateDoubtSession;