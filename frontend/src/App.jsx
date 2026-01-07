import React from 'react'
import { Navigate, Route, Routes } from 'react-router-dom'
import Home from './pages/Home'
import Auth from './pages/Auth'
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
import AdminLogin from './pages/admin/AdminLogin';
import Contact from './pages/Contact';
import VoiceRoom from './components/VoiceRoom';
import StudentVoiceRequest from './pages/StudentVoiceRequest';
import TeacherCallRequests from './pages/teacher/TeacherCallRequests';
import AdminVoiceMonitor from './pages/admin/AdminVoiceMonitor';
import TermsAndConditions from './pages/TermsAndConditions';
import PrivacyPolicy from './pages/PrivacyPolicy';
import RefundPolicy from './pages/RefundPolicy';
import CookiePolicy from './pages/CookiePolicy';
import CookieConsent from './components/CookieConsent';

import FinishSignUp from './pages/FinishSignUp';
import AdminDoubtSessions from './pages/admin/AdminDoubtSessions';
import VerifyEmail from './pages/VerifyEmail';
import VerifyEmailPage from './pages/VerifyEmailPage';
import EducatorLogin from './pages/educator/EducatorLogin';
import EducatorSignUp from './pages/educator/EducatorSignUp';
import EducatorApprovals from './pages/admin/EducatorApprovals';
import AuthProvider from './components/AuthProvider';


// Admin Route Protection Component
const AdminProtectedRoute = ({ children }) => {
  const adminToken = localStorage.getItem('adminToken');
  if (!adminToken) {
    return <Navigate to="/admin/login" />;
  }
  return children;
};


export const serverUrl = "http://localhost:8000"
function App() {

  let { userData } = useSelector(state => state.user)

  getCurrentUser()
  getCouseData()
  getCreatorCourseData()
  getAllReviews()
  return (
    <>
      {/* Firebase Auth Token Refresh Provider */}
      <AuthProvider />

      <ToastContainer />
      <ScrollToTop />
      <CookieConsent />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<Auth />} />
        <Route path='/about' element={<About />} />
        <Route path='/feedback' element={<Feedback />} />
        <Route path='/signup' element={!userData ? <Auth /> : <Navigate to={"/"} />} />
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
        <Route path='/admin/login' element={<AdminLogin />} />
        <Route path='/admin/feedback-manager' element={<AdminProtectedRoute><AdminFeedbackManager /></AdminProtectedRoute>} />
        <Route path='/admin/dashboard' element={<AdminProtectedRoute><AdminDashboard /></AdminProtectedRoute>} />
        <Route path='/contact' element={<Contact />} />
        <Route path='/voice-request' element={userData?.role === "student" ? <StudentVoiceRequest /> : <Navigate to={"/signup"} />} />
        <Route path='/voice-room/:roomId' element={userData ? <VoiceRoom /> : <Navigate to={"/signup"} />} />
        <Route path='/teacher/call-requests' element={userData?.role === "educator" ? <TeacherCallRequests /> : <Navigate to={"/signup"} />} />
        <Route path='/admin/voice-monitor' element={<AdminProtectedRoute><AdminVoiceMonitor /></AdminProtectedRoute>} />
        <Route path='/admin/doubt-sessions' element={<AdminProtectedRoute><AdminDoubtSessions /></AdminProtectedRoute>} />
        <Route path='/admin/educator-approvals' element={<AdminProtectedRoute><EducatorApprovals /></AdminProtectedRoute>} />
        <Route path='/forgotpassword' element={<ForgotPassword />} />

        {/* Legal Pages */}
        <Route path='/terms' element={<TermsAndConditions />} />
        <Route path='/privacy' element={<PrivacyPolicy />} />
        <Route path='/refund' element={<RefundPolicy />} />
        <Route path='/cookies' element={<CookiePolicy />} />

        {/* Email Link Authentication removed */}
        <Route path='/verify-email/:token' element={<VerifyEmail />} />
        <Route path='/verify-email-sent' element={<VerifyEmailPage />} />
        <Route path='/finishSignUp' element={<FinishSignUp />} />

        {/* Educator Authentication - Separate from Student Auth */}
        <Route path='/educator/login' element={!userData ? <EducatorLogin /> : <Navigate to={"/dashboard"} />} />
        <Route path='/educator/signup' element={!userData ? <EducatorSignUp /> : <Navigate to={"/dashboard"} />} />

      </Routes>

    </>

  )
}

export default App
