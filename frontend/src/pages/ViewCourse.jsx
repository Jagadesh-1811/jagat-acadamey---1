import axios from 'axios';
import React, { useEffect, useState } from 'react'
import { useDispatch, useSelector } from 'react-redux';
import { useNavigate, useParams } from 'react-router-dom';
import { serverUrl } from '../App';
import { FaArrowLeftLong } from "react-icons/fa6";
import img from "../assets/empty.jpg"
import Card from "../components/Card.jsx"
import { setSelectedCourseData } from '../redux/courseSlice';
import { FaLock, FaPlayCircle } from "react-icons/fa";
import { toast } from 'react-toastify';
import { FaStar } from "react-icons/fa6";
import { ClipLoader } from 'react-spinners';

const getGradeColor = (grade, isBackground = false) => {
    switch (grade) {
        case 'A': return isBackground ? '#D4EDDA' : '#28A745'; // Green
        case 'B': return isBackground ? '#CCE5FF' : '#007BFF'; // Blue
        case 'C': return isBackground ? '#FFF3CD' : '#FFC107'; // Yellow
        case 'D': return isBackground ? '#F8D7DA' : '#DC3545'; // Red
        default: return isBackground ? '#E2E6EA' : '#6C757D'; // Gray
    }
};

function ViewCourse() {

      const { courseId } = useParams();
      const navigate = useNavigate()
    const {courseData} = useSelector(state=>state.course)
    const {userData, token} = useSelector(state=>state.user)
    const [creatorData , setCreatorData] = useState(null)
    const dispatch = useDispatch()
    const [selectedLecture, setSelectedLecture] = useState(null);
    const {lectureData} = useSelector(state=>state.lecture)
    const {selectedCourseData} = useSelector(state=>state.course)
  const [selectedCreatorCourse,setSelectedCreatorCourse] = useState([])
   const [isEnrolled, setIsEnrolled] = useState(false);
   const [rating, setRating] = useState(0);
   const [comment, setComment] = useState("");
   const [submissionLinks, setSubmissionLinks] = useState({});
   const [studentSubmissionsWithGrades, setStudentSubmissionsWithGrades] = useState([]);
   const [courseMaterials, setCourseMaterials] = useState([]);
   const [fetchingMaterials, setFetchingMaterials] = useState(true);
   const [courseQuizzes, setCourseQuizzes] = useState([]);
   const [doubtSession, setDoubtSession] = useState(null);

  const handleAssignmentSubmit = async (assignmentId) => {
    try {
        const submissionLink = submissionLinks[assignmentId];
        if (!submissionLink) {
            toast.error("Please provide a submission link.");
            return;
        }
        const { data } = await axios.post(
            `${serverUrl}/api/submission/submit`,
            { assignmentId, submissionLink },
            { headers: { Authorization: `Bearer ${token}` } }
        );
        toast.success(data.message);
    } catch (error) {
        console.error("Error submitting assignment:", error);
        toast.error(error.response?.data?.message || error.message || "An unexpected error occurred.");
    }
};

   
   
  


  const handleReview = async () => {
    if (rating === 0) {
      toast.error("Please provide a rating (1-5 stars).");
      return;
    }
    try {
      const result = await axios.post(serverUrl + "/api/review/givereview" , {rating , comment , courseId} , { headers: { Authorization: `Bearer ${token}` } })
      toast.success("Review Added")
      console.log(result.data)
      setRating(0)
      setComment("")

    } catch (error) {
      console.log(error)
      toast.error(error.response.data.message)
    }
  }
  

  const calculateAverageRating = (reviews) => {
  if (!reviews || reviews.length === 0) return 0;

  const total = reviews.reduce((sum, review) => sum + review.rating, 0);
  return (total / reviews.length).toFixed(1); // rounded to 1 decimal
};

// Usage:
const avgRating = calculateAverageRating(selectedCourseData?.reviews);
console.log("Average Rating:", avgRating);

  

  const fetchCourseData = async () => {
    courseData.map((item) => {
      if (item && item._id === courseId) {
      dispatch(setSelectedCourseData(item))
        console.log(selectedCourseData)
      

        return null;
      }

    })

  }
    const checkEnrollment = () => {
  const verify = userData?.enrolledCourses?.some(c => {
    const enrolledId = (c && typeof c === 'object') ? c._id : c;
    return enrolledId?.toString() === courseId?.toString();
  });

  console.log("Enrollment verified:", verify);
  if (verify) {
    setIsEnrolled(true);
  }
};
  useEffect(() => {
    fetchCourseData()
    checkEnrollment()
  }, [courseId,courseData,lectureData,userData])

  useEffect(() => {
    const fetchStudentGrades = async () => {
      if (userData?._id && courseId) {
        try {
          const result = await axios.get(`${serverUrl}/api/grade/student`, { headers: { Authorization: `Bearer ${token}` } });
          // Filter grades for the current course
          const gradesForCurrentCourse = result.data.grades.filter(grade => 
            grade.submission?.assignment?.course?._id === courseId
          );
          setStudentSubmissionsWithGrades(gradesForCurrentCourse);
        } catch (error) {
          console.error("Error fetching student grades:", error);
          toast.error(error.response?.data?.message || "Failed to fetch student grades.");
        }
      }
    };

    const fetchCourseMaterials = async () => {
      if (isEnrolled) {
        try {
          setFetchingMaterials(true);
          const response = await axios.get(`${serverUrl}/api/material/course/${courseId}/materials`, { headers: { Authorization: `Bearer ${token}` } });
          setCourseMaterials(response.data);
        } catch (error) {
          console.error("Error fetching course materials:", error);
          toast.error(error.response?.data?.message || "Failed to fetch course materials.");
        } finally {
          setFetchingMaterials(false);
        }
      }
    };

    const fetchCourseQuizzes = async () => {
      if (isEnrolled) { // Only fetch quizzes if enrolled
        try {
          const response = await axios.get(`${serverUrl}/api/quiz/course/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
          setCourseQuizzes(response.data.quizzes);
        } catch (error) {
          console.error("Error fetching course quizzes:", error);
          toast.error(error.response?.data?.message || "Failed to fetch course quizzes.");
        }
      }
    };

    const fetchDoubtSession = async () => {
      if (isEnrolled) { // Only fetch doubt session if enrolled
        try {
          const response = await axios.get(`${serverUrl}/api/doubt-session/doubt-session/${courseId}`, { headers: { Authorization: `Bearer ${token}` } });
          setDoubtSession(response.data[0]);
        } catch (error) {
          console.error("Error fetching doubt session:", error);
          // Don't show toast for 404, as it means no session is set yet
          if (error.response?.status !== 404) {
            toast.error(error.response?.data?.message || "Failed to fetch doubt session.");
          }
        }
      }
    };

    fetchStudentGrades();
    fetchCourseMaterials();
    fetchCourseQuizzes();
    fetchDoubtSession();
  }, [courseId, userData?._id, isEnrolled, token]);


    // Fetch creator info once course data is available
  useEffect(() => {
    const getCreator = async () => {
      if (selectedCourseData?.creator) {
        try {
          const result = await axios.post(
            `${serverUrl}/api/course/getcreator`,
            { userId: selectedCourseData.creator },
            { headers: { Authorization: `Bearer ${token}` } }
          );
          setCreatorData(result.data);
          console.log(result.data)
        } catch (error) {
          console.error("Error fetching creator:", error);
        }
      }
    };

    getCreator();

    
  }, [selectedCourseData, token]);


   


  useEffect(() => {
  if (creatorData?._id && courseData.length > 0) {
    const creatorCourses = courseData.filter(
      (course) =>
        course.creator === creatorData._id && course && course._id !== courseId // Exclude current course
    );
    setSelectedCreatorCourse(creatorCourses);
  
  }
}, [creatorData, courseData]);

 
const handleEnroll = async (courseId, userId) => {
  if (!userId) {
    toast.error("Please log in to enroll in the course.");
    return;
  }
  try {
    // 1. Create Order
    const orderData = await axios.post(serverUrl + "/api/payment/create-order", {
      courseId,
      userId
    } , { headers: { Authorization: `Bearer ${token}` } });
    console.log(orderData)

    const options = {
      key: import.meta.env.VITE_RAZORPAY_KEY_ID, // from .env
      amount: orderData.data.amount,
      currency: "INR",
      name: "Virtual Courses",
      description: "Course Enrollment Payment",
      order_id: orderData.data.id,
      handler: async function (response) {
  console.log("Razorpay Response:", response);
  try {
    const verifyRes = await axios.post(serverUrl + "/api/payment/verify-payment",{
  ...response,       
  courseId,
  userId
}, { headers: { Authorization: `Bearer ${token}` } });
    
setIsEnrolled(true)
    toast.success(verifyRes.data.message);
    // Re-fetch user data to update enrolledCourses in Redux store
    const updatedUserResult = await axios.get(serverUrl + "/api/user/currentuser" , { headers: { Authorization: `Bearer ${token}` } })
    dispatch(setUserData(updatedUserResult.data))
  } catch (verifyError) {
    toast.error("Payment verification failed.");
    console.error("Verification Error:", verifyError);
  }
  },
    };
    
    const rzp = new window.Razorpay(options)
    rzp.open()

  } catch (err) {
    toast.error("Something went wrong while enrolling.");
    console.error("Enroll Error:", err);
  }
};

  return (
     <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto bg-white shadow-md rounded-xl p-6 space-y-6 relative">

        {/* Top Section */}
        <div className="flex flex-col md:flex-row gap-6 ">
             
          {/* Thumbnail */}
          <div className="w-full md:w-1/2">
             <FaArrowLeftLong  className='text-[black] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
            {selectedCourseData?.thumbnail ? <img
              src={selectedCourseData?.thumbnail}
              alt="Course Thumbnail"
              className="rounded-xl w-full object-cover"
            /> :  <img
              src={img}
              alt="Course Thumbnail"
              className="rounded-xl  w-full  object-cover"
            /> }
          </div>

          {/* Course Info */}
          <div className="flex-1 space-y-2 mt-[20px]">
            <h1 className="text-2xl font-bold">{selectedCourseData?.title}</h1>
            <p className="text-gray-600">{selectedCourseData?.subTitle}</p>

            {/* Rating & Price */}
            <div className="flex items-start flex-col justify-between">
              <div className="text-yellow-500 font-medium">
                ⭐ {avgRating} <span className="text-gray-500">(1,200 reviews)</span>
              </div>
              <div>
                <span className="text-lg font-semibold text-black">{selectedCourseData?.price}</span>{" "}
                <span className="line-through text-sm text-gray-400">₹599</span>
              </div>
            </div>

            {/* Highlights */}
            <ul className="text-sm text-gray-700 space-y-1 pt-2">
              <li>✅ 10+ hours of video content</li>
              <li>✅ Lifetime access to course materials</li>
              
            </ul>

            {/* Enroll Button */}
                  {!isEnrolled ?<button className="bg-[black] text-white px-6 py-2 rounded hover:bg-gray-700 mt-3" onClick={()=>handleEnroll(courseId , userData?._id)}>
                    Enroll Now
                  </button> :
                  <button className="bg-green-200 text-green-600 px-6 py-2 rounded hover:bg-gray-100 hover:border mt-3" onClick={()=>navigate(`/viewlecture/${courseId}`)}>
                   Watch Now
                  </button>
                  }
                  {isEnrolled && doubtSession && (
                    <a href={doubtSession.meetingLink} target="_blank" rel="noopener noreferrer" className="bg-purple-500 text-white px-6 py-2 rounded hover:bg-purple-700 mt-3 ml-2">
                        Doubt Solving Session
                    </a>
                  )}
                  </div>
                </div>

                {/* What You'll Learn */}
        <div>
          <h2 className="text-xl font-semibold mb-2">What You’ll Learn</h2>
          <ul className="list-disc pl-6 text-gray-700 space-y-1">
            <li>Learn {selectedCourseData?.category} from Beginning</li>
            
          </ul>
        </div>

        {/* Requirements */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Requirements</h2>
          <p className="text-gray-700">Basic programming knowledge is helpful but not required.</p>
        </div>

        {/* Who This Course Is For */}
        <div>
          <h2 className="text-xl font-semibold mb-2">Who This Course is For</h2>
          <p className="text-gray-700">
            Beginners, aspiring developers, and professionals looking to upgrade skills.
          </p>
        </div>

        {isEnrolled && (
    <div>
        <h2 className="text-xl font-semibold mb-2">Assignments</h2>
        {selectedCourseData?.assignments?.map((assignment) => {
            if (!assignment) return null;

            const studentGrade = studentSubmissionsWithGrades.find(
                (gradeEntry) => gradeEntry.submission?.assignment?._id === assignment._id
            );

            return (
                <div key={assignment._id} className="border p-4 rounded-lg mb-4">
                    <h3 className="text-lg font-semibold">{assignment.title}</h3>
                    <p className="text-gray-600">{assignment.description}</p>
                    <p className="text-sm text-gray-500">Deadline: {new Date(assignment.deadline).toLocaleString()}</p>

                    {studentGrade ? (
                        <div className="mt-4 p-3 rounded-md"
                            style={{ backgroundColor: getGradeColor(studentGrade.grade, true) }}>
                            <p className="font-semibold">Your Grade: <span style={{ color: getGradeColor(studentGrade.grade) }}>{studentGrade.grade}</span></p>
                            <p className="text-gray-700">Feedback: {studentGrade.feedback}</p>
                        </div>
                    ) : (
                        <div className="mt-4">
                            <input
                                type="text"
                                placeholder="Enter your submission link"
                                className="w-full border border-gray-300 rounded-lg p-2"
                                onChange={(e) => setSubmissionLinks(prev => ({ ...prev, [assignment._id]: e.target.value }))}
                            />
                            <button
                                className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800"
                                onClick={() => handleAssignmentSubmit(assignment._id)}
                            >
                                Submit
                            </button>
                        </div>
                    )}
                </div>
            );
        })}

        {/* Course Materials Section */}
        <div className="mt-8">
            <h2 className="text-xl font-semibold mb-2">Course Materials</h2>
            {fetchingMaterials ? (
                <div className="flex justify-center items-center h-20">
                    <ClipLoader size={30} color='#000' />
                </div>
            ) : courseMaterials.length === 0 ? (
                <p className="text-gray-600">No materials available for this course yet.</p>
            ) : (
                <ul className="space-y-3">
                    {courseMaterials.map((material) => (
                        <li key={material._id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                            <div>
                                <p className="font-medium">{material.title}</p>
                                <p className="text-sm text-gray-500">{material.fileType} - {(material.fileSize / 1024).toFixed(2)} KB</p>
                            </div>
                            <a
                                href={material.url}
                                target="_blank"
                                rel="noopener noreferrer"
                                download={material.title} // Added download attribute
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Download
                            </a>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    </div>
)}

        {/* Course Quizzes Section */}
        {isEnrolled && courseQuizzes.length > 0 && (
            <div className="mt-8">
                <h2 className="text-xl font-semibold mb-2">Course Quizzes</h2>
                <ul className="space-y-3">
                    {courseQuizzes.map((quiz) => (
                        <li key={quiz._id} className="flex items-center justify-between p-3 border rounded-md bg-gray-50">
                            <div>
                                <p className="font-medium">{quiz.instructions}</p>
                                <p className="text-sm text-gray-500">Scheduled: {new Date(quiz.schedule).toLocaleString()}</p>
                                <p className="text-sm text-gray-500">Rewards: {quiz.rewards}</p>
                            </div>
                            <a
                                href={quiz.quizLink}
                                target="_blank"
                                rel="noopener noreferrer"
                                className="text-blue-600 hover:underline text-sm"
                            >
                                Take Quiz
                            </a>
                        </li>
                    ))}
                </ul>
            </div>
        )}

        {/* course lecture   */}
         <div className="flex flex-col md:flex-row gap-6">
  {/* Left Side - Curriculum */}
  <div className="bg-white w-full md:w-2/5 p-6 rounded-2xl shadow-lg border border-gray-200">
    <h2 className="text-xl font-bold mb-1 text-gray-800">Course Curriculum</h2>
    <p className="text-sm text-gray-500 mb-4">{selectedCourseData?.lectures?.length} Lectures</p>

    <div className="flex flex-col gap-3">
      {selectedCourseData?.lectures?.map((lecture, index) => (
        <button
          key={index}
          disabled={!lecture.isPreviewFree}
          onClick={() => {
            if (lecture.isPreviewFree) {
              setSelectedLecture(lecture);
            }
          }}
          className={`flex items-center gap-3 px-4 py-3 rounded-lg border transition-all duration-200 text-left ${
            lecture.isPreviewFree
              ? "hover:bg-gray-100 cursor-pointer border-gray-300"
              : "cursor-not-allowed opacity-60 border-gray-200"
          } ${
            selectedLecture?.lectureTitle === lecture.lectureTitle
              ? "bg-gray-100 border-gray-400"
              : ""
          }`}
        >
          <span className="text-lg text-gray-700">
            {lecture.isPreviewFree ? <FaPlayCircle /> : <FaLock />}
          </span>
          <span className="text-sm font-medium text-gray-800">
            {lecture.lectureTitle}
          </span>
        </button>
      ))}
    </div>
  </div>

  {/* Right Side - Video + Info */}
  <div className="bg-white w-full md:w-3/5 p-6 rounded-2xl shadow-lg border border-gray-200">
    <div className="aspect-video w-full rounded-lg overflow-hidden mb-4 bg-black flex items-center justify-center">
      {selectedLecture?.videoUrl ? (
        <video
          src={selectedLecture.videoUrl}
          controls
          className="w-full h-full object-cover"
        />
      ) : (
        <span className="text-white text-sm">Select a preview lecture to watch</span>
      )}
    </div>

    <h3 className="text-lg font-semibold text-gray-900 mb-1">
      {selectedLecture?.lectureTitle || "Lecture Title"}
    </h3>
    <p className="text-gray-600 text-sm">
      {selectedCourseData?.title}
    </p>
  </div>
</div>
<div className="mt-8 border-t pt-6">
    <h2 className="text-xl font-semibold mb-2">Write a Review</h2>
    <div className="mb-4">
      <div className="flex gap-1 mb-2">
        {[1, 2, 3, 4, 5].map((star) => (
         
            <FaStar  key={star}
            onClick={() => setRating(star)} className={star <= rating ? "fill-yellow-500" : "fill-gray-300"} />
         
        ))}
      </div>
      <textarea
        value={comment}
        onChange={(e) => setComment(e.target.value)}
        placeholder="Write your comment here..."
        className="w-full border border-gray-300 rounded-lg p-2"
        rows="3"
      />
      <button
        
        className="bg-black text-white mt-3 px-4 py-2 rounded hover:bg-gray-800" onClick={handleReview}
      >
        Submit Review
      </button>
    </div>

        {/* Instructor Info */}
        <div className="flex items-center gap-4 pt-4 border-t ">
          {creatorData?.photoUrl ?<img
            src={creatorData?.photoUrl}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />: <img
            src={img}
            alt="Instructor"
            className="w-16 h-16 rounded-full object-cover"
          />
          }
          <div>
            <h3 className="text-lg font-semibold">{creatorData?.name}</h3>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.description}</p>
            <p className="md:text-sm text-gray-600 text-[10px] ">{creatorData?.email}</p>
            
          </div>
        </div>
        <div>
          <p className='text-xl font-semibold mb-2'>Other Published Courses by the Educator -</p>
        <div className='w-full transition-all duration-300 py-[20px]   flex items-start justify-center lg:justify-start flex-wrap gap-6 lg:px-[80px] '>
          
            {
                                selectedCreatorCourse?.map((item,index)=>( item &&
                                    <Card key={index} thumbnail={item.thumbnail} title={item.title} id={item._id} price={item.price} category={item.category}/>
                                ))            }
        </div>
      </div>
    </div>
    </div>
    </div>
  )
}

export default ViewCourse
