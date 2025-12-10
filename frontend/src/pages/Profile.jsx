import React from 'react'
import { useSelector, useDispatch } from 'react-redux'
import { useNavigate } from 'react-router-dom'
import { FaArrowLeftLong } from "react-icons/fa6";
import axios from 'axios'
import { serverUrl } from '../App'
import { setUserData, setToken } from '../redux/userSlice'
import UserFeedbackList from '../components/UserFeedbackList'

function Profile() {
  let { userData, token } = useSelector(state => state.user)
  let dispatch = useDispatch()
  let navigate = useNavigate()
  const handleDelete = async () => {
    const ok = window.confirm('Are you sure you want to delete your account? This action cannot be undone.')
    if (!ok) return
    try {
      const headers = {
        Authorization: `Bearer ${token}`
      }
      await axios.delete(serverUrl + '/api/auth/delete', { headers })
      // clear local user state
      dispatch(setUserData({}))
      dispatch(setToken(''))
      // clear local storage if token stored there
      localStorage.removeItem('token')
      navigate('/')
      alert('Account deleted successfully')
    } catch (error) {
      console.error('Delete account error', error)
      alert(error.response?.data?.message || 'Failed to delete account')
    }
  }
  return (
    <div className="min-h-screen bg-gray-100 px-4 py-10 flex flex-col items-center justify-start gap-6">

      <div className="bg-white shadow-lg rounded-2xl p-8 max-w-xl w-full relative">
        <FaArrowLeftLong className='absolute top-[8%] left-[5%] w-[22px] h-[22px] cursor-pointer' onClick={() => navigate("/")} />
        {/* Profile Header */}
        <div className="flex flex-col items-center text-center">
          {userData?.photoUrl ? <img
            src={userData?.photoUrl}
            alt=""
            className="w-24 h-24 rounded-full object-cover border-4 border-[black]"
          /> : <div className='w-24 h-24 rounded-full text-white flex items-center justify-center text-[30px] border-2 bg-black  border-white cursor-pointer'>
            {userData?.name ? userData.name.slice(0, 1).toUpperCase() : ''}
          </div>}
          <h2 className="text-2xl font-bold mt-4 text-gray-800">{userData?.name || ''}</h2>
          <p className="text-sm text-gray-500">{userData?.role || ''}</p>
        </div>

        {/* Profile Info */}
        <div className="mt-6 space-y-4">
          <div className="text-sm">
            <span className="font-semibold text-gray-700">Email: </span>
            <span>{userData.email}</span>
          </div>

          <div className="text-sm">
            <span className="font-semibold text-gray-700">Bio: </span>
            <span>{userData.description}</span>
          </div>



          <div className="text-sm">
            <span className="font-semibold text-gray-700">Enrolled Courses: </span>
            <span>{userData?.enrolledCourses ? userData.enrolledCourses.length : 0}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="mt-6 flex justify-center gap-4">
          <button className="px-5 py-2 rounded bg-[black] text-white active:bg-[#4b4b4b] cursor-pointer transition" onClick={() => navigate("/editprofile")}>
            Edit Profile
          </button>
          <button className="px-5 py-2 rounded bg-red-600 text-white active:bg-red-700 cursor-pointer transition" onClick={handleDelete}>
            Delete Account
          </button>
        </div>
      </div>

      {/* User Feedback Section */}
      <div className="bg-white shadow-lg rounded-2xl p-6 max-w-xl w-full">
        <h3 className="text-lg font-semibold text-gray-800 mb-4">My Feedback & Issues</h3>
        <UserFeedbackList userEmail={userData?.email} />
        <button
          onClick={() => navigate('/feedback')}
          className="mt-4 w-full py-2 bg-gray-100 text-gray-700 rounded-lg hover:bg-gray-200 transition-colors text-sm font-medium"
        >
          Submit New Feedback
        </button>
      </div>
    </div>
  )
}

export default Profile

