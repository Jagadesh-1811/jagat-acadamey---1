import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import axios from 'axios';
import { serverUrl } from '../../config';
import { toast } from 'react-toastify';
import { FaArrowLeftLong, FaEye } from 'react-icons/fa6';
import { MdEdit } from 'react-icons/md';
import { ClipLoader } from 'react-spinners';
import { useSelector } from 'react-redux';

function Assignments() {
    const { courseId } = useParams();
    const navigate = useNavigate();
    const { token } = useSelector(state => state.user);
    const [assignments, setAssignments] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchAssignments = async () => {
            try {
                const result = await axios.get(`${serverUrl}/api/assignment/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
                setAssignments(result.data.assignments);
            } catch (error) {
                console.error("Error fetching assignments:", error);
                toast.error(error.response?.data?.message || "Failed to fetch assignments.");
            } finally {
                setLoading(false);
            }
        };
        fetchAssignments();
    }, [courseId, token]);

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
                    <FaArrowLeftLong className="w-5 h-5 cursor-pointer" onClick={() => navigate(`/addcourses/${courseId}`)} />
                    <h2 className="text-2xl font-semibold">Assignments for Course</h2>
                </div>
                <button
                    className="bg-black text-white px-4 py-2 rounded-md hover:bg-gray-700"
                    onClick={() => navigate(`/admin/create-assignment/${courseId}`)}
                >
                    Create New Assignment
                </button>
            </div>

            {assignments.length === 0 ? (
                <p className="text-center text-gray-600">No assignments found for this course.</p>
            ) : (
                <div className="space-y-4">
                    {assignments.map((assignment) => (
                        <div key={assignment._id} className="bg-gray-50 p-4 rounded-md shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center">
                            <div>
                                <h3 className="text-lg font-medium">{assignment.title}</h3>
                                <p className="text-gray-600 text-sm">{assignment.description}</p>
                                <p className="text-gray-500 text-xs">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>
                            </div>
                                                                                    <div className="flex gap-3 mt-3 md:mt-0">
                                                                                        <button
                                                                                            className="bg-gray-300 text-gray-800 px-3 py-1 rounded-md hover:bg-gray-400 flex items-center gap-1 text-sm"
                                                                                            onClick={() => navigate(`/admin/edit-assignment/${courseId}/${assignment._id}`)}
                                                                                        >
                                                                                            <MdEdit /> Edit
                                                                                        </button>
                                                                                    </div>                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

export default Assignments;
