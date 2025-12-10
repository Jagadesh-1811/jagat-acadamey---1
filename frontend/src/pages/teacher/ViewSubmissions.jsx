import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import { FaArrowLeftLong } from 'react-icons/fa6';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

const SubmissionCard = ({ submission, grades, feedback, onGradeChange, onFeedbackChange, onAssignGrade, submittingGrade }) => {
    const getGradeColor = (grade, isBackground = false) => {
        switch (grade) {
            case 'A': return isBackground ? '#D4EDDA' : '#28A745'; // Green
            case 'B': return isBackground ? '#CCE5FF' : '#007BFF'; // Blue
            case 'C': return isBackground ? '#FFF3CD' : '#FFC107'; // Yellow
            case 'D': return isBackground ? '#F8D7DA' : '#DC3545'; // Red
            default: return isBackground ? '#E2E6EA' : '#6C757D'; // Gray
        }
    };

    return (
        <div key={submission._id} className="bg-gray-50 p-4 rounded-md shadow-sm">
            <div className="flex justify-between items-center mb-2">
                <h3 className="text-lg font-medium">Student: {submission.student.name}</h3>
                <p className="text-gray-500 text-sm">Submitted: {new Date(submission.submittedAt).toLocaleDateString()}</p>
            </div>
            <p className="text-gray-700">Submission Link: <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-600 hover:underline">{submission.submissionLink}</a></p>

            {submission.grade ? (
                <div className="mt-4 p-3 rounded-md"
                    style={{ backgroundColor: getGradeColor(submission.grade.grade, true) }}>
                    <p className="font-semibold">Grade: <span style={{ color: getGradeColor(submission.grade.grade) }}>{submission.grade.grade}</span></p>
                    <p className="text-gray-700">Feedback: {submission.grade.feedback}</p>
                </div>
            ) : (
                <div className="mt-4 p-3 bg-yellow-100 rounded-md">
                    <h4 className="font-semibold mb-2">Assign Grade</h4>
                    <div className="flex flex-col sm:flex-row gap-3">
                        <select
                            className="w-full sm:w-1/3 border px-3 py-2 rounded-md bg-white"
                            value={grades[submission._id] || ''}
                            onChange={(e) => onGradeChange(submission._id, e.target.value)}
                        >
                            <option value="">Select Grade</option>
                            <option value="A">A</option>
                            <option value="B">B</option>
                            <option value="C">C</option>
                            <option value="D">D</option>
                        </select>
                        <textarea
                            className="w-full sm:flex-1 border px-3 py-2 rounded-md resize-none"
                            placeholder="Add feedback (optional)"
                            value={feedback[submission._id] || ''}
                            onChange={(e) => onFeedbackChange(submission._id, e.target.value)}
                        ></textarea>
                        <button
                            className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700 w-full sm:w-auto"
                            onClick={() => onAssignGrade(submission._id)}
                            disabled={submittingGrade}
                        >
                            {submittingGrade ? <ClipLoader size={20} color='white' /> : 'Submit Grade'}
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
};

function ViewSubmissions() {
    const { token } = useSelector(state => state.user);
    const { courseId, assignmentId } = useParams();
    const navigate = useNavigate();
    const [submissions, setSubmissions] = useState([]);
    const [loading, setLoading] = useState(true);
    const [grades, setGrades] = useState({}); // State to hold grades for each submission
    const [feedback, setFeedback] = useState({}); // State to hold feedback for each submission
    const [submittingGrade, setSubmittingGrade] = useState(false);

    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/submission/${assignmentId}`, { headers: { Authorization: `Bearer ${token}` } });
                setSubmissions(result.data.submissions);
                // Initialize grades and feedback states
                const initialGrades = {};
                const initialFeedback = {};
                result.data.submissions.forEach(sub => {
                    if (sub.grade) {
                        initialGrades[sub._id] = sub.grade.grade; // Assuming grade object is populated
                        initialFeedback[sub._id] = sub.grade.feedback; // Assuming grade object is populated
                    }
                });
                setGrades(initialGrades);
                setFeedback(initialFeedback);
            } catch (error) {
                console.error("Error fetching submissions:", error);
                toast.error(error.response?.data?.message || "Failed to fetch submissions.");
            } finally {
                setLoading(false);
            }
        };
        fetchSubmissions();
    }, [assignmentId, token]);

    const handleGradeChange = (submissionId, value) => {
        setGrades(prev => ({ ...prev, [submissionId]: value }));
    };

    const handleFeedbackChange = (submissionId, value) => {
        setFeedback(prev => ({ ...prev, [submissionId]: value }));
    };

    const assignGrade = async (submissionId) => {
        setSubmittingGrade(true);
        try {
            const selectedGrade = grades[submissionId];
            const selectedFeedback = feedback[submissionId];

            if (!selectedGrade) {
                toast.error("Please select a grade.");
                setSubmittingGrade(false);
                return;
            }

            const result = await axios.post(
                `${serverUrl}/api/grade/assign`,
                { submissionId, grade: selectedGrade, feedback: selectedFeedback },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success(result.data.message);
            // Update the submission in state to reflect the new grade
            setSubmissions(prevSubmissions =>
                prevSubmissions.map(sub =>
                    sub._id === submissionId ? { ...sub, grade: result.data.grade } : sub
                )
            );
        } catch (error) {
            console.error("Error assigning grade:", error);
            toast.error(error.response?.data?.message || "Failed to assign grade.");
        } finally {
            setSubmittingGrade(false);
        }
    };

    if (loading) {
        return (
            <div className="flex justify-center items-center min-h-screen">
                <ClipLoader size={50} color={'#000'} />
            </div>
        );
    }

    return (
        <div className="max-w-5xl mx-auto p-6 mt-10 bg-white rounded-lg shadow-md">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-3">
                    <FaArrowLeftLong className="w-5 h-5 cursor-pointer" onClick={() => navigate(`/admin/assignments/${courseId}`)} />
                    <h2 className="text-2xl font-semibold">Submissions for Assignment</h2>
                </div>
            </div>

            {submissions.length === 0 ? (
                <p className="text-center text-gray-600">No submissions found for this assignment.</p>
            ) : (
                <div className="space-y-4">
                    {submissions.map((submission) => (
                        <SubmissionCard
                            key={submission._id}
                            submission={submission}
                            grades={grades}
                            feedback={feedback}
                            onGradeChange={handleGradeChange}
                            onFeedbackChange={handleFeedbackChange}
                            onAssignGrade={assignGrade}
                            submittingGrade={submittingGrade}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}

export default ViewSubmissions;