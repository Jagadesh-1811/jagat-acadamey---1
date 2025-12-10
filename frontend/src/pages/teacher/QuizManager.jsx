import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

function QuizManager() {
    const { creatorCourseData } = useSelector((state) => state.course);
    const { token } = useSelector(state => state.user);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [quizLink, setQuizLink] = useState('');
    const [liveSessionLink, setLiveSessionLink] = useState('');
    const [instructions, setInstructions] = useState('');
    const [rewards, setRewards] = useState('');
    const [schedule, setSchedule] = useState(''); // YYYY-MM-DDTHH:MM format
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (selectedCourse) {
            fetchQuizzes(selectedCourse);
        }
    }, [selectedCourse, token]);

    const fetchQuizzes = async (courseId) => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${serverUrl}/api/quiz/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
            setQuizzes(data.quizzes);
        } catch (error) {
            console.error("Error fetching quizzes:", error);
            toast.error(error.response?.data?.message || "Failed to fetch quizzes.");
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!selectedCourse) {
            toast.error("Please select a course.");
            return;
        }
        if (!quizLink || !liveSessionLink || !instructions || !rewards || !schedule) {
            toast.error("All fields are required.");
            return;
        }

        setLoading(true);
        try {
            const quizData = {
                quizLink,
                liveSessionLink,
                instructions,
                rewards,
                schedule: new Date(schedule).toISOString(),
            };

            if (editingQuizId) {
                await axios.put(`${serverUrl}/api/quiz/${editingQuizId}`, quizData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Quiz updated successfully!");
            } else {
                await axios.post(`${serverUrl}/api/quiz/create/${selectedCourse}`, quizData, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Quiz created successfully!");
            }
            
            // Clear form and refetch quizzes
            setQuizLink('');
            setLiveSessionLink('');
            setInstructions('');
            setRewards('');
            setSchedule('');
            setEditingQuizId(null);
            fetchQuizzes(selectedCourse);

        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error(error.response?.data?.message || "Failed to save quiz.");
        } finally {
            setLoading(false);
        }
    };

    const handleEdit = (quiz) => {
        setEditingQuizId(quiz._id);
        setQuizLink(quiz.quizLink);
        setLiveSessionLink(quiz.liveSessionLink);
        setInstructions(quiz.instructions);
        setRewards(quiz.rewards);
        // Format schedule for datetime-local input
        const scheduledDate = new Date(quiz.schedule);
        const year = scheduledDate.getFullYear();
        const month = (scheduledDate.getMonth() + 1).toString().padStart(2, '0');
        const day = scheduledDate.getDate().toString().padStart(2, '0');
        const hours = scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
        setSchedule(`${year}-${month}-${day}T${hours}:${minutes}`);
    };

    const handleDelete = async (quizId) => {
        if (window.confirm("Are you sure you want to delete this quiz?")) {
            setLoading(true);
            try {
                await axios.delete(`${serverUrl}/api/quiz/${quizId}`, { headers: { Authorization: `Bearer ${token}` } });
                toast.success("Quiz deleted successfully!");
                fetchQuizzes(selectedCourse);
            } catch (error) {
                console.error("Error deleting quiz:", error);
                toast.error(error.response?.data?.message || "Failed to delete quiz.");
            } finally {
                setLoading(false);
            }
        }
    };

    return (
        <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
            <h2 className="text-xl font-bold mb-4">Quiz Manager</h2>

            <div className="mb-4">
                <label htmlFor="courseSelect" className="block text-sm font-medium text-gray-700">Select Course:</label>
                <select
                    id="courseSelect"
                    className="mt-1 block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-black focus:border-black sm:text-sm rounded-md"
                    value={selectedCourse}
                    onChange={(e) => setSelectedCourse(e.target.value)}
                >
                    <option value="">-- Select a Course --</option>
                    {Array.isArray(creatorCourseData) && creatorCourseData.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label htmlFor="quizLink" className="block text-sm font-medium text-gray-700">Quiz Link (Google Forms, Typeform, etc.):</label>
                        <input
                            type="url"
                            id="quizLink"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={quizLink}
                            onChange={(e) => setQuizLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="liveSessionLink" className="block text-sm font-medium text-gray-700">Live Session Link (Google Meet, Zoom, etc.):</label>
                        <input
                            type="url"
                            id="liveSessionLink"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={liveSessionLink}
                            onChange={(e) => setLiveSessionLink(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="instructions" className="block text-sm font-medium text-gray-700">Instructions:</label>
                        <textarea
                            id="instructions"
                            rows="3"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={instructions}
                            onChange={(e) => setInstructions(e.target.value)}
                            required
                        ></textarea>
                    </div>
                    <div>
                        <label htmlFor="rewards" className="block text-sm font-medium text-gray-700">Reward Details:</label>
                        <input
                            type="text"
                            id="rewards"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={rewards}
                            onChange={(e) => setRewards(e.target.value)}
                            required
                        />
                    </div>
                    <div>
                        <label htmlFor="schedule" className="block text-sm font-medium text-gray-700">Schedule (Date and Time):</label>
                        <input
                            type="datetime-local"
                            id="schedule"
                            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-black focus:border-black sm:text-sm"
                            value={schedule}
                            onChange={(e) => setSchedule(e.target.value)}
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="inline-flex justify-center py-2 px-4 border border-transparent shadow-sm text-sm font-medium rounded-md text-white bg-black hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        disabled={loading}
                    >
                        {loading ? <ClipLoader size={20} color="#fff" /> : (editingQuizId ? "Update Quiz" : "Create Quiz")}
                    </button>
                    {editingQuizId && (
                        <button
                            type="button"
                            onClick={() => {
                                setEditingQuizId(null);
                                setQuizLink('');
                                setLiveSessionLink('');
                                setInstructions('');
                                setRewards('');
                                setSchedule('');
                            }}
                            className="ml-2 inline-flex justify-center py-2 px-4 border border-gray-300 shadow-sm text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-black"
                        >
                            Cancel Edit
                        </button>
                    )}
                </form>
            )}

            {selectedCourse && quizzes.length > 0 && (
                <div className="mt-8">
                    <h3 className="text-lg font-bold mb-2">Existing Quizzes</h3>
                    <ul className="divide-y divide-gray-200">
                        {quizzes.map((quiz) => (
                            <li key={quiz._id} className="py-4 flex justify-between items-center">
                                <div>
                                    <p className="text-md font-semibold">Quiz Link: <a href={quiz.quizLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{quiz.quizLink}</a></p>
                                    <p className="text-sm text-gray-600">Schedule: {new Date(quiz.schedule).toLocaleString()}</p>
                                    <p className="text-sm text-gray-600">Rewards: {quiz.rewards}</p>
                                </div>
                                <div>
                                    <button
                                        onClick={() => handleEdit(quiz)}
                                        className="text-indigo-600 hover:text-indigo-900 text-sm mr-4"
                                    >
                                        Edit
                                    </button>
                                    <button
                                        onClick={() => handleDelete(quiz._id)}
                                        className="text-red-600 hover:text-red-900 text-sm"
                                    >
                                        Delete
                                    </button>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            )}
            {selectedCourse && quizzes.length === 0 && !loading && (
                <p className="mt-4 text-gray-600">No quizzes found for this course. Create one above!</p>
            )}
        </div>
    );
}

export default QuizManager;
