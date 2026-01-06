import React from 'react'
import ArrowForwardOutlinedIcon from '@mui/icons-material/ArrowForwardOutlined';
import ComputerOutlinedIcon from '@mui/icons-material/ComputerOutlined';
import DesignServicesOutlinedIcon from '@mui/icons-material/DesignServicesOutlined';
import PhoneIphoneOutlinedIcon from '@mui/icons-material/PhoneIphoneOutlined';
import SecurityOutlinedIcon from '@mui/icons-material/SecurityOutlined';
import PsychologyOutlinedIcon from '@mui/icons-material/PsychologyOutlined';
import AssessmentOutlinedIcon from '@mui/icons-material/AssessmentOutlined';
import AutoAwesomeOutlinedIcon from '@mui/icons-material/AutoAwesomeOutlined';
import { useNavigate } from 'react-router-dom';

function ExploreCourses() {
  const navigate = useNavigate()
  return (
    <div className='w-[100vw] min-h-[50vh] lg:h-[50vh] flex flex-col lg:flex-row items-center justify-center gap-4 px-[30px]'>
      <div className='w-[100%] lg:w-[350px] lg:h-[100%] h-[400px]  flex flex-col items-start justify-center gap-1 md:px-[40px]  px-[20px]'>
        <span className='text-[35px] font-semibold'>Explore</span>
        <span className='text-[35px] font-semibold'>Our Courses</span>
        <p className='text-[17px]'>Lorem ipsum dolor sit amet consectetur adipisicing elit. Rem vel iure explicabo laboriosam accusantium expedita laudantium facere magnam.</p>
        <button className='px-[20px] py-[10px] border-2 bg-[black] border-white text-white rounded-[10px] text-[18px] font-light flex gap-2 mt-[40px]' onClick={() => navigate("/allcourses")}>Explore Courses <ArrowForwardOutlinedIcon sx={{ color: 'white', fontSize: 28 }} /></button>

      </div>
      <div className='w-[720px] max-w-[90%] lg:h-[300px] md:min-h-[300px] flex items-center justify-center lg:gap-[60px] gap-[50px] flex-wrap mb-[50px] lg:mb-[0px]'>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
          <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><ComputerOutlinedIcon sx={{ fontSize: 50, color: '#6d6c6c' }} /></div>
          Web Devlopment
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
          <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><DesignServicesOutlinedIcon sx={{ fontSize: 50, color: '#6d6c6c' }} /></div>
          UI UX Designing
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
          <div className='w-[100px] h-[90px] bg-[#fcb9c8] rounded-lg flex items-center justify-center '><PhoneIphoneOutlinedIcon sx={{ fontSize: 45, color: '#6d6c6c' }} /></div>
          App Devlopment
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
          <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><SecurityOutlinedIcon sx={{ fontSize: 45, color: '#6d6c6c' }} /></div>
          Ethical Hacking
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
          <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><PsychologyOutlinedIcon sx={{ fontSize: 50, color: '#6d6c6c' }} /></div>
          AI/ML
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center '>
          <div className='w-[100px] h-[90px] bg-[#fbd9fb] rounded-lg flex items-center justify-center '><AssessmentOutlinedIcon sx={{ fontSize: 45, color: '#6d6c6c' }} /></div>
          Data Analytics
        </div>
        <div className='w-[100px] h-[130px] font-light text-[13px] flex flex-col gap-3 text-center'>
          <div className='w-[100px] h-[90px] bg-[#d9fbe0] rounded-lg flex items-center justify-center '><AutoAwesomeOutlinedIcon sx={{ fontSize: 45, color: '#6d6c6c' }} /></div>
          AI Tools
        </div>
      </div>


    </div>
  )
}

export default ExploreCourses
