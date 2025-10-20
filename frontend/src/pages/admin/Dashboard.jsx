import React, { useState, useEffect } from 'react'
import { useSelector } from "react-redux";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid } from "recharts";
import img from "../../assets/empty.jpg"; // fallback photo
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios';
import { serverUrl } from '../../App';
import { ClipLoader } from 'react-spinners';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import QuizManager from './QuizManager';



const getGradeColor = (grade, isBackground = false) => {
    switch (grade) {
        case 'A': return isBackground ? '#D4EDDA' : '#28A745'; // Green
        case 'B': return isBackground ? '#CCE5FF' : '#007BFF'; // Blue
        case 'C': return isBackground ? '#FFF3CD' : '#FFC107'; // Yellow
        case 'D': return isBackground ? '#F8D7DA' : '#DC3545'; // Red
        default: return isBackground ? '#E2E6EA' : '#6C757D'; // Gray
    }
};

function Dashboard() {
  const navigate = useNavigate()
  const { userData, token } = useSelector((state) => state.user);
  const { creatorCourseData } = useSelector((state) => state.course);
  const [submissions, setSubmissions] = useState({});
  const [grades, setGrades] = useState({}); // State to hold grades for each submission
  const [feedback, setFeedback] = useState({}); // State to hold feedback for each submission
  const [submittingGrade, setSubmittingGrade] = useState(false);
  const [loadingSubmissions, setLoadingSubmissions] = useState(true);


  const handleGradeChange = (submissionId, value) => {
      setGrades(prev => ({ ...prev, [submissionId]: value }));
  };

  const handleFeedbackChange = (submissionId, value) => {
      setFeedback(prev => ({ ...prev, [submissionId]: value }));
  };

  const assignGrade = async (submissionId, assignmentId) => {
      setSubmittingGrade(true);
      try {
          const selectedGrade = grades[submissionId];
          const selectedFeedback = feedback[submissionId];

          if (!selectedGrade) {
              toast.error("Please select a grade.");
              setSubmittingGrade(false);
              return;
          }

          // Validate required fields before sending
          if (!submissionId || !assignmentId) {
              toast.error("Submission or Assignment ID missing.");
              setSubmittingGrade(false);
              return;
          }

          const result = await axios.post(
              `${serverUrl}/api/grade/assign`,
              { submissionId, assignmentId, grade: selectedGrade, feedback: selectedFeedback || "" },
              { headers: { Authorization: `Bearer ${token}` } }
          );
          // Refetch submissions for the assignment to get updated grade
          const { data } = await axios.get(
              `${serverUrl}/api/submission/${assignmentId}`,
              { headers: { Authorization: `Bearer ${token}` } }
          );
          setSubmissions(prevSubmissions => ({
              ...prevSubmissions,
              [assignmentId]: data.submissions
          }));
          toast.success("Grade assigned successfully!");
      } catch (error) {
          console.error("Error assigning grade:", error);
          toast.error(error.response?.data?.message || error.message || "Failed to assign grade.");
      } finally {
          setSubmittingGrade(false);
      }
  };

  useEffect(() => {
      const fetchSubmissions = async () => {
          try {
              setLoadingSubmissions(true);
              const newSubmissions = {};
              for (const course of creatorCourseData) {
                  if (course.assignments) { // Ensure assignments exist
                      for (const assignment of course.assignments) {
                          if (assignment && assignment._id) { // Check if assignment and assignment._id are not null/undefined
                            const { data } = await axios.get(
                                `${serverUrl}/api/submission/${assignment._id}`,
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            newSubmissions[assignment._id] = data.submissions;
                          }
                      }
                  }
              }
              setSubmissions(newSubmissions);
          } catch (error) {
              console.error("Error fetching submissions:", error);
          } finally {
              setLoadingSubmissions(false);
          }
      };
    
      if (creatorCourseData) {
          fetchSubmissions();
      }
    }, [creatorCourseData, token]);

  // update based on your store

  // Sample data - Replace with real API/course data
  const courseProgressData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    lectures: course.lectures.length || 0
  })) || [];

  const enrollData = creatorCourseData?.map(course => ({
    name: course.title.slice(0, 10) + "...",
    enrolled: course.enrolledStudents?.length || 0
  })) || [];

  const totalEarnings = creatorCourseData?.reduce((sum, course) => {
    const studentCount = course.enrolledStudents?.length || 0;
    const courseRevenue = course.price ? course.price * studentCount : 0;
    return sum + courseRevenue;
  }, 0) || 0;

  return (
    <div className="flex min-h-screen bg-gray-100">
      <FaArrowLeftLong className=' w-[22px] absolute top-[10%]
      left-[10%] h-[22px] cursor-pointer' onClick={() => navigate("/")} />
      <div className="w-full px-6 py-10   bg-gray-50 space-y-10">
        {/* Welcome Section */}
        <div className="max-w-5xl mx-auto bg-white rounded-xl shadow-md p-6 flex flex-col md:flex-row items-center gap-6">
          <img
            src={userData?.photoUrl || img}
            alt="Educator"
            className="w-28 h-28 rounded-full object-cover border-4 border-black shadow-md"
          />
          <div className="text-center md:text-left space-y-1">
            <h1 className="text-2xl font-bold text-gray-800">
              Welcome, {userData?.name || "Educator"} 👋
            </h1>
            <h1 className='text-xl font-semibold text-gray-800'>Total Earning : <span className='font-light text-gray-900'>₹{totalEarnings.toLocaleString()}</span>  </h1>
            <p className="text-gray-600 text-sm">
              {userData?.description || "Start creating amazing courses for your students!"}
            </p>
            <h1 className='px-[10px] text-center  py-[10px] border-2  bg-black border-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer' onClick={() => navigate("/courses")}>Create Courses</h1>
          </div>
        </div>

        {/* Graphs Section */}
        <div className="max-w-6xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-8">
          {/* Course Progress Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Course Progress (Lectures)</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={courseProgressData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="lectures" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Enrolled Students Chart */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-lg font-semibold mb-4">Student Enrollment</h2>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={enrollData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Bar dataKey="enrolled" fill="black" radius={[5, 5, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>

                <div className="max-w-6xl mx-auto bg-white rounded-xl shadow-md p-6 mt-8">
                    <h2 className="text-xl font-bold mb-4">Assignment Submissions</h2>
                    {loadingSubmissions ? (
                        <div className="flex justify-center items-center h-40">
                            <ClipLoader size={30} color={'#000'} />
                        </div>
                    ) : (
                        <>
                            {creatorCourseData?.map((course) => (
                                <div key={course._id} className="mb-8">
                                    <h3 className="text-lg font-semibold mb-2">{course.title}</h3>
                                    {course.assignments?.map((assignment) => (
                                        <div key={assignment._id} className="border p-4 rounded-lg mb-4">
                                            <h4 className="text-md font-semibold">{assignment.title}</h4>
                                            <ul className="list-disc pl-6 mt-2">
                                                {submissions[assignment._id]?.map((submission) => (
                                                    <li key={submission._id} className="text-sm border-b pb-2 mb-2 last:border-b-0">
                                                        <span className="font-semibold">{submission.student.name}: </span>
                                                        <a href={submission.submissionLink} target="_blank" rel="noopener noreferrer" className="text-blue-500 hover:underline">
                                                            {submission.submissionLink}
                                                        </a>
                                                        {submission.grade ? (
                                                            <div
                                                                className="mt-2 p-2 rounded-md"
                                                                style={{ backgroundColor: getGradeColor(submission.grade.grade, true) }}
                                                            >
                                                                <p className="font-semibold">
                                                                    Grade: <span style={{ color: getGradeColor(submission.grade.grade) }}>{submission.grade.grade}</span>
                                                                </p>
                                                                <p className="text-gray-700">Feedback: {submission.grade.feedback}</p>
                                                            </div>
                                                        ) : (
                                                            <div className="mt-2 p-2 bg-yellow-100 rounded-md">
                                                                <h5 className="font-semibold mb-1">Assign Grade</h5>
                                                                <div className="flex flex-col sm:flex-row gap-2">
                                                                    <select
                                                                        className="w-full sm:w-1/3 border px-3 py-2 rounded-md bg-white"
                                                                        value={grades[submission._id] || ''}
                                                                        onChange={(e) => handleGradeChange(submission._id, e.target.value)}
                                                                    >
                                                                        <option value="">Select Grade</option>
                                                                        <option value="A">A</option>
                                                                        <option value="B">B</option>
                                                                        <option value="C">C</option>
                                                                        <option value="D">D</option>
                                                                    </select>
                                                                    <textarea
                                                                        className="w-full sm:flex-1 border px-2 py-1 rounded-md resize-none text-sm"
                                                                        placeholder="Add feedback (optional)"
                                                                        value={feedback[submission._id] || ''}
                                                                        onChange={(e) => handleFeedbackChange(submission._id, e.target.value)}
                                                                        rows="1"
                                                                    ></textarea>
                                                                    <button
                                                                        className="bg-black text-white px-3 py-1 rounded-md hover:bg-gray-700 w-full sm:w-auto text-sm"
                                                                        onClick={() => assignGrade(submission._id, assignment._id)}
                                                                        disabled={submittingGrade}
                                                                    >
                                                                        {submittingGrade ? <ClipLoader size={15} color={'white'} /> : 'Submit'}
                                                                    </button>
                                                                </div>
                                                            </div>
                                                        )}
                                                    </li>
                                                ))}
                                            </ul>
                                        </div>
                                    ))}
                                </div>
                            ))}
                        </>
                    )}
                </div>
                <QuizManager />
            </div>
        </div>
    );
}

export default Dashboard;
