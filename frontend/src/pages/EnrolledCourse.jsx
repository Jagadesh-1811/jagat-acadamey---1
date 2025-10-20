import React, { useEffect, useState } from 'react'

import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { useNavigate } from 'react-router-dom';
import { FaArrowLeftLong } from "react-icons/fa6";
import MonthlyQuiz from '../components/MonthlyQuiz';
import StreakCounter from '../components/StreakCounter';
import ProgressBar from '../components/ProgressBar';

function EnrolledCourse() {
  const navigate = useNavigate()
  const [averageGrade, setAverageGrade] = useState(null);

  const { userData, token } = useSelector((state) => state.user);

  useEffect(() => {
    const fetchAverageGrade = async () => {
      if (userData?._id) {
        try {
          const result = await axios.get(`${serverUrl}/api/grade/average`, {
            headers: {
              Authorization: `Bearer ${token}`
            }
          });
          setAverageGrade(result.data.averageGrade);
        } catch (error) {
          console.error("Error fetching average grade:", error);
        }
      }
    };
    fetchAverageGrade();
  }, [userData?._id, token]);

     
   
 

  return (
    <div className="min-h-screen w-full px-4 py-9 bg-gray-50">
      

      <FaArrowLeftLong  className='absolute top-[3%] md:top-[6%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={()=>navigate("/")}/>
      <h1 className="text-3xl text-center font-bold text-gray-800 mb-6  ">
        My Enrolled Courses
      </h1>
      <div className="flex justify-center mb-6">
        <StreakCounter />
      </div>

      <MonthlyQuiz />

      {averageGrade !== null && (
        <div className="bg-blue-100 p-4 rounded-lg shadow-md mb-6 text-center">
          <p className="text-xl font-semibold text-blue-800">Your Average Grade: {averageGrade}</p>
        </div>
      )}

      {userData.enrolledCourses.length === 0 ? (
        <p className="text-gray-500 text-center w-full">You haven’t enrolled in any course yet.</p>
      ) : (
        <div className="flex items-center justify-center flex-wrap gap-[30px]">
          {userData.enrolledCourses.map((course) => (
            <div
              key={course?._id || `enrolled-course-${course.title}-${Math.random()}`}
              className="bg-white rounded-2xl shadow-md overflow-hidden border"
            >
              <img
                src={course.thumbnail}
                alt={course.title}
                className="w-full h-40 object-cover"
              />
              <div className="p-4">
                <h2 className="text-lg font-semibold text-gray-800">{course.title}</h2>
                <p className="text-sm text-gray-600 mb-2">{course.category}</p>
                <p className="text-sm text-gray-700">{course.level}</p>
                <div className="mt-4">
                  <ProgressBar percentage={Math.floor(Math.random() * 101)} height="h-3" textSize="text-xs" />
                </div>
                <h1 className='px-[10px] text-center  py-[10px] border-2  bg-black border-black text-white  rounded-[10px] text-[15px] font-light flex items-center justify-center gap-2 cursor-pointer mt-[10px] hover:bg-gray-600' onClick={()=>navigate(`/viewlecture/${course._id}`)}>Watch Now</h1>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

export default EnrolledCourse
