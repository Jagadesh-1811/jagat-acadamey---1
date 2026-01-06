import React, { useState } from 'react'
import logo from "../assets/logo.jpg"
import { IoMdPerson } from "react-icons/io";
import { GiHamburgerMenu } from "react-icons/gi";
import { GiSplitCross } from "react-icons/gi";

import { useNavigate } from 'react-router-dom';
import { serverUrl } from '../App';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useDispatch, useSelector } from 'react-redux';
import { setUserData, setToken } from '../redux/userSlice';
function Nav() {
  let [showHam, setShowHam] = useState(false)
  let [showPro, setShowPro] = useState(false)
  let navigate = useNavigate()
  let dispatch = useDispatch()
  let { userData } = useSelector(state => state.user)

  const handleLogout = async () => {
    try {
      dispatch(setUserData(null))
      dispatch(setToken(null))
      localStorage.removeItem('token');
      toast.success("LogOut Successfully")
    } catch (error) {
      console.log(error)
      toast.error("Logout failed")
    }
  }
  return (
    <div>
      <div className='w-full h-[80px] fixed top-0 z-50 bg-gray-500/20 backdrop-blur-md border-b border-gray-300 shadow-sm'>
        <div className='max-w-7xl mx-auto px-6 h-full flex items-center justify-between'>

          {/* Logo Section */}
          <div className='flex items-center gap-3 cursor-pointer' onClick={() => navigate("/")}>
            <img src={logo} className='w-[50px] h-[50px] rounded-lg border border-gray-200 object-cover' alt="Logo" />
            <span className='text-white font-bold text-xl tracking-tight hidden sm:block'>JAGAT ACADEMY</span>
          </div>

          {/* Desktop Menu */}
          <div className='hidden lg:flex items-center gap-6'>
            {!userData ? (
              <div className='w-[45px] h-[45px] rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center cursor-pointer hover:bg-gray-200 transition-all' onClick={() => setShowPro(prev => !prev)}>
                <IoMdPerson className='w-[24px] h-[24px] fill-black' />
              </div>
            ) : (
              <div className='relative cursor-pointer' onClick={() => setShowPro(prev => !prev)}>
                {userData?.photoUrl ? (
                  <img src={userData.photoUrl} className='w-[45px] h-[45px] rounded-full object-cover border-2 border-gray-300 grayscale' alt="Profile" />
                ) : (
                  <div className='w-[45px] h-[45px] rounded-full bg-black text-white flex items-center justify-center text-lg font-bold border-2 border-gray-300'>
                    {userData?.name ? userData.name.slice(0, 1).toUpperCase() : 'U'}
                  </div>
                )}
              </div>
            )}

            {userData && (
              <>
                <div className='px-6 py-2 bg-white text-black rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors' onClick={() => navigate("/dashboard")}>
                  Dashboard
                </div>
                <span className='px-6 py-2 bg-white text-black rounded-full font-medium cursor-pointer hover:bg-gray-200 transition-colors' onClick={handleLogout}>
                  Log Out
                </span>
              </>
            )}

            {!userData && (
              <span className='px-8 py-2.5 bg-white border border-black text-black rounded-full font-medium cursor-pointer hover:bg-gray-100 transition-all' onClick={() => navigate("/login")}>
                Login
              </span>
            )}
          </div>

          {/* Profile Dropdown */}
          {showPro && (
            <div className='absolute top-[90px] right-[20px] lg:right-[calc((100vw-1280px)/2+20px)] w-[200px] bg-white border border-gray-200 rounded-xl shadow-2xl overflow-hidden flex flex-col py-2 animate-fade-in'>
              <span className='px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors' onClick={() => { navigate("/profile"); setShowPro(false); }}>My Profile</span>
              <span className='px-6 py-3 text-gray-700 hover:bg-gray-100 hover:text-black cursor-pointer transition-colors' onClick={() => { navigate("/enrolledcourses"); setShowPro(false); }}>My Courses</span>
            </div>
          )}

          {/* Mobile Hamburger */}
          <GiHamburgerMenu className='w-[30px] h-[30px] text-black lg:hidden cursor-pointer' onClick={() => setShowHam(prev => !prev)} />
        </div>
      </div>

      {/* Mobile Sidebar */}
      <div className={`fixed inset-0 bg-gray-100/95 z-[60] flex flex-col items-center justify-center gap-8 duration-300 ease-in-out ${showHam ? "translate-x-0 opacity-100" : "translate-x-full opacity-0 pointer-events-none"}`}>
        <GiSplitCross className='w-[40px] h-[40px] text-black absolute top-6 right-6 cursor-pointer hover:rotate-90 transition-transform' onClick={() => setShowHam(false)} />

        {/* Mobile Profile Icon */}
        {!userData ? (
          <div className='w-[80px] h-[80px] rounded-full bg-gray-100 border border-gray-300 flex items-center justify-center mb-4'>
            <IoMdPerson className='w-[40px] h-[40px] fill-black' />
          </div>
        ) : (
          <div className='w-[80px] h-[80px] rounded-full overflow-hidden border-2 border-gray-300 mb-4'>
            {userData?.photoUrl ? (
              <img src={userData.photoUrl} className='w-full h-full object-cover grayscale' alt="" />
            ) : (
              <div className='w-full h-full bg-black flex items-center justify-center text-3xl font-bold text-white'>
                {userData?.name ? userData.name.slice(0, 1).toUpperCase() : 'U'}
              </div>
            )}
          </div>
        )}

        {/* Mobile Links */}
        <span className='text-2xl text-black font-medium hover:text-gray-600 cursor-pointer' onClick={() => { navigate("/profile"); setShowHam(false); }}>My Profile</span>
        <span className='text-2xl text-black font-medium hover:text-gray-600 cursor-pointer' onClick={() => { navigate("/enrolledcourses"); setShowHam(false); }}>My Courses</span>

        {userData ? (
          <>
            <div className='px-10 py-3 bg-white text-black rounded-full text-xl font-medium cursor-pointer hover:bg-gray-200 transition-colors' onClick={() => { navigate("/dashboard"); setShowHam(false); }}>Dashboard</div>
            <span className='text-xl text-black font-medium cursor-pointer hover:text-gray-600' onClick={() => { handleLogout(); setShowHam(false); }}>Log Out</span>
          </>
        ) : (
          <span className='px-12 py-3 border border-black text-black rounded-full text-xl font-medium cursor-pointer hover:bg-gray-100 transition-all' onClick={() => { navigate("/login"); setShowHam(false); }}>Login</span>
        )}
      </div>
    </div>

  )
}

export default Nav