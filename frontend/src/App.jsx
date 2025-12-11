import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Login from './pages/Login'
import SignUp from './pages/SignUp'
import { ToastContainer } from 'react-toastify';
import ForgotPassword from './pages/ForgotPassword'
import getCurrentUser from './customHooks/getCurrentUser'
import { useSelector } from 'react-redux'
import Profile from './pages/Profile'
import EditProfile from './pages/EditProfile'
import Dashboard from './pages/teacher/Dashboard'
import Courses from './pages/teacher/Courses'
import AllCouses from './pages/AllCouses'
import AddCourses from './pages/teacher/AddCourses'
import CreateCourse from './pages/teacher/CreateCourse'
import CreateLecture from './pages/teacher/CreateLecture'
import EditLecture from './pages/teacher/EditLecture'
import CreateAssignment from './pages/teacher/CreateAssignment'

import getCouseData from './customHooks/getCouseData'
import ViewCourse from './pages/ViewCourse'
import ScrollToTop from './components/ScrollToTop'
import getCreatorCourseData from './customHooks/getCreatorCourseData'
import EnrolledCourse from './pages/EnrolledCourse'
import ViewLecture from './pages/ViewLecture'
import SearchWithAi from './pages/SearchWithAi'
import About from './pages/About'
import Feedback from './pages/Feedback'
import getAllReviews from './customHooks/getAllReviews'
import StudentDashboard from './pages/Dashboard.jsx'
import CertificateManager from './pages/teacher/CertificateManager'
import CreateDoubtSession from './pages/teacher/CreateDoubtSession';
import AdminDashboard from './pages/admin/AdminDashboard';
import AdminFeedbackManager from './pages/admin/FeedbackManager';
import Contact from './pages/Contact';


export const serverUrl = "https://jagat-acadamey-1.onrender.com"

function App() {

  let { userData } = useSelector(state => state.user)

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()
  return (
    <>

      <ToastContainer />
      <ScrollToTop />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Login />} />
        <Route path='/about' element={<About />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/signup' element={!userData ? <SignUp /> : <Navigate to={"/"} />} />
        <Route path='/profile' element={userData ? <Profile /> : <Navigate to={"/signup"} />} />
        <Route path='/allcourses' element={userData ? <AllCouses /> : <Navigate to={"/signup"} />} />
        <Route path='/viewcourse/:courseId' element={userData ? <ViewCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/editprofile' element={userData ? <EditProfile /> : <Navigate to={"/signup"} />} />
        <Route path='/enrolledcourses' element={userData ? <EnrolledCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/viewlecture/:courseId' element={userData ? <ViewLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/searchwithai' element={userData ? <SearchWithAi /> : <Navigate to={"/signup"} />} />


        <Route path='/dashboard' element={userData?.role === "educator" ? <Dashboard /> : userData?.role === "student" ? <StudentDashboard /> : <Navigate to={"/signup"} />} />
        <Route path='/courses' element={userData?.role === "educator" ? <Courses /> : <Navigate to={"/signup"} />} />
        <Route path='/addcourses/:courseId' element={userData?.role === "educator" ? <AddCourses /> : <Navigate to={"/signup"} />} />
        <Route path='/createcourses' element={userData?.role === "educator" ? <CreateCourse /> : <Navigate to={"/signup"} />} />
        <Route path='/createlecture/:courseId' element={userData?.role === "educator" ? <CreateLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/editlecture/:courseId/:lectureId' element={userData?.role === "educator" ? <EditLecture /> : <Navigate to={"/signup"} />} />
        <Route path='/admin/create-assignment/:courseId' element={userData?.role === "educator" ? <CreateAssignment /> : <Navigate to={"/signup"} />} />
        <Route path='/admin/create-doubt-session/:courseId' element={userData?.role === "educator" ? <CreateDoubtSession /> : <Navigate to={"/signup"} />} />
        <Route path='/admin/certificate-manager' element={userData?.role === "educator" ? <CertificateManager /> : <Navigate to={"/signup"} />} />
        <Route path='/admin/feedback-manager' element={<AdminFeedbackManager />} />
        <Route path='/admin/dashboard' element={<AdminDashboard />} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />
      </Routes>

    </>

  )
}

export default App
