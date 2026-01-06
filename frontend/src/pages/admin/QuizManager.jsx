import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import OpenInNewIcon from '@mui/icons-material/OpenInNew';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EmojiEventsIcon from '@mui/icons-material/EmojiEvents';
import VideocamIcon from '@mui/icons-material/Videocam';

function QuizManager() {
    const { creatorCourseData } = useSelector((state) => state.course);
    const { token } = useSelector(state => state.user);
    const [selectedCourse, setSelectedCourse] = useState('');
    const [quizzes, setQuizzes] = useState([]);
    const [quizLink, setQuizLink] = useState('');
    const [liveSessionLink, setLiveSessionLink] = useState('');
    const [instructions, setInstructions] = useState('');
    const [rewards, setRewards] = useState('');
    const [schedule, setSchedule] = useState('');
    const [editingQuizId, setEditingQuizId] = useState(null);
    const [loading, setLoading] = useState(false);
    const [showForm, setShowForm] = useState(false);

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

            resetForm();
            fetchQuizzes(selectedCourse);
        } catch (error) {
            console.error("Error submitting quiz:", error);
            toast.error(error.response?.data?.message || "Failed to save quiz.");
        } finally {
            setLoading(false);
        }
    };

    const resetForm = () => {
        setQuizLink('');
        setLiveSessionLink('');
        setInstructions('');
        setRewards('');
        setSchedule('');
        setEditingQuizId(null);
        setShowForm(false);
    };

    const handleEdit = (quiz) => {
        setEditingQuizId(quiz._id);
        setQuizLink(quiz.quizLink);
        setLiveSessionLink(quiz.liveSessionLink);
        setInstructions(quiz.instructions);
        setRewards(quiz.rewards);
        const scheduledDate = new Date(quiz.schedule);
        const year = scheduledDate.getFullYear();
        const month = (scheduledDate.getMonth() + 1).toString().padStart(2, '0');
        const day = scheduledDate.getDate().toString().padStart(2, '0');
        const hours = scheduledDate.getHours().toString().padStart(2, '0');
        const minutes = scheduledDate.getMinutes().toString().padStart(2, '0');
        setSchedule(`${year}-${month}-${day}T${hours}:${minutes}`);
        setShowForm(true);
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

    const isUpcoming = (scheduleDate) => new Date(scheduleDate) > new Date();

    return (
        <div className="admin-card">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <span className="w-2 h-8 bg-black rounded-full"></span>
                        Quiz Manager
                    </h2>
                    <p className="text-gray-500 text-sm mt-1">Create and manage course quizzes</p>
                </div>
            </div>

            {/* Course Selection */}
            <div className="mb-6">
                <label className="admin-label">Select Course</label>
                <select
                    className="admin-input admin-select"
                    value={selectedCourse}
                    onChange={(e) => {
                        setSelectedCourse(e.target.value);
                        setShowForm(false);
                        resetForm();
                    }}
                >
                    <option value="">-- Select a Course --</option>
                    {Array.isArray(creatorCourseData) && creatorCourseData.map((course) => (
                        <option key={course._id} value={course._id}>{course.title}</option>
                    ))}
                </select>
            </div>

            {selectedCourse && (
                <>
                    {/* Add Quiz Button */}
                    {!showForm && (
                        <button
                            onClick={() => setShowForm(true)}
                            className="bg-black text-white px-4 py-2 rounded-md mb-6 flex items-center gap-2"
                        >
                            <FaPlus className="w-4 h-4" />
                            Add New Quiz
                        </button>
                    )}

                    {/* Quiz Form */}
                    {showForm && (
                        <form onSubmit={handleSubmit} className="bg-gray-50 rounded-xl p-6 mb-6 border border-gray-200">
                            <h3 className="font-bold mb-4 flex items-center gap-2">
                                {editingQuizId ? <FaEdit /> : <FaPlus />}
                                {editingQuizId ? 'Edit Quiz' : 'Create New Quiz'}
                            </h3>

                            <div className="grid md:grid-cols-2 gap-4 mb-4">
                                <div>
                                    <label className="admin-label">Quiz Link</label>
                                    <input
                                        type="url"
                                        className="admin-input"
                                        placeholder="Google Forms, Typeform, etc."
                                        value={quizLink}
                                        onChange={(e) => setQuizLink(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">Live Session Link</label>
                                    <input
                                        type="url"
                                        className="admin-input"
                                        placeholder="Google Meet, Zoom, etc."
                                        value={liveSessionLink}
                                        onChange={(e) => setLiveSessionLink(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="mb-4">
                                <label className="admin-label">Instructions</label>
                                <textarea
                                    className="admin-input resize-none"
                                    rows="3"
                                    placeholder="Quiz instructions for students..."
                                    value={instructions}
                                    onChange={(e) => setInstructions(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="grid md:grid-cols-2 gap-4 mb-6">
                                <div>
                                    <label className="admin-label">Rewards</label>
                                    <input
                                        type="text"
                                        className="admin-input"
                                        placeholder="e.g., Certificate, 100 points"
                                        value={rewards}
                                        onChange={(e) => setRewards(e.target.value)}
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="admin-label">Schedule</label>
                                    <input
                                        type="datetime-local"
                                        className="admin-input"
                                        value={schedule}
                                        onChange={(e) => setSchedule(e.target.value)}
                                        required
                                    />
                                </div>
                            </div>

                            <div className="flex gap-3">
                                <button
                                    type="submit"
                                    className="bg-black text-white px-4 py-2 rounded-md"
                                    disabled={loading}
                                >
                                    {loading ? <ClipLoader size={20} color="#fff" /> : (editingQuizId ? "Update Quiz" : "Create Quiz")}
                                </button>
                                <button
                                    type="button"
                                    onClick={resetForm}
                                    className="bg-white text-black border border-black px-4 py-2 rounded-md"
                                >
                                    Cancel
                                </button>
                            </div>
                        </form>
                    )}

                    {/* Quiz List */}
                    {loading && !showForm ? (
                        <div className="flex justify-center items-center h-32">
                            <ClipLoader size={30} color="#000" />
                        </div>
                    ) : quizzes.length === 0 ? (
                        <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                            <div className="admin-icon-box admin-icon-box-light w-16 h-16 mx-auto mb-4">
                                <FaTrophy className="w-8 h-8" />
                            </div>
                            <p className="text-gray-600 font-medium">No quizzes found for this course</p>
                            <p className="text-gray-400 text-sm">Create your first quiz above!</p>
                        </div>
                    ) : (
                        <div className="space-y-4">
                            <h4 className="font-bold text-gray-700">Scheduled Quizzes ({quizzes.length})</h4>
                            {quizzes.map((quiz) => (
                                <div
                                    key={quiz._id}
                                    className="admin-list-item flex-col items-start gap-4 cursor-default hover:transform-none"
                                >
                                    <div className="flex items-start justify-between w-full">
                                        <div className="flex-1">
                                            <div className="flex items-center gap-2 mb-2">
                                                {isUpcoming(quiz.schedule) ? (
                                                    <span className="admin-badge admin-badge-success">Upcoming</span>
                                                ) : (
                                                    <span className="admin-badge admin-badge-warning">Past</span>
                                                )}
                                                <span className="text-sm text-gray-500 flex items-center gap-1">
                                                    <FaClock className="w-3 h-3" />
                                                    {new Date(quiz.schedule).toLocaleString()}
                                                </span>
                                            </div>
                                            <p className="text-gray-700 mb-1">{quiz.instructions}</p>
                                            <div className="flex items-center gap-4 text-sm">
                                                <span className="flex items-center gap-1 text-gray-500">
                                                    <FaTrophy className="w-3 h-3" />
                                                    {quiz.rewards}
                                                </span>
                                            </div>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <a
                                                href={quiz.quizLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-btn admin-btn-ghost py-2 px-3"
                                            >
                                                <FaExternalLinkAlt className="w-3 h-3" />
                                                Quiz
                                            </a>
                                            <a
                                                href={quiz.liveSessionLink}
                                                target="_blank"
                                                rel="noopener noreferrer"
                                                className="admin-btn admin-btn-ghost py-2 px-3"
                                            >
                                                <FaVideo className="w-3 h-3" />
                                                Live
                                            </a>
                                            <button
                                                onClick={() => handleEdit(quiz)}
                                                className="admin-btn admin-btn-secondary py-2 px-3"
                                            >
                                                <FaEdit className="w-3 h-3" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(quiz._id)}
                                                className="p-2 bg-black text-white rounded-lg transition-colors"
                                            >
                                                <FaTrash className="w-4 h-4" />
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </>
            )}

            {!selectedCourse && (
                <div className="text-center py-12 bg-gray-50 rounded-xl border border-dashed border-gray-300">
                    <div className="admin-icon-box admin-icon-box-light w-16 h-16 mx-auto mb-4">
                        <FaTrophy className="w-8 h-8" />
                    </div>
                    <p className="text-gray-600 font-medium">Select a course to manage quizzes</p>
                    <p className="text-gray-400 text-sm">Choose from the dropdown above</p>
                </div>
            )}
        </div>
    );
}

export default QuizManager;
