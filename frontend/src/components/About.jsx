import React from 'react'
import {
  FaInfoCircle,
  FaCheckCircle,
  FaPlayCircle,
  FaUsers,
  FaChartLine,
  FaMedal,
  FaHeadset
} from 'react-icons/fa';

function About() {
  return (
    <div className='w-full min-h-[80vh] flex flex-col items-center justify-center py-16 px-4 md:px-8 bg-white'>

      {/* Section Header */}
      <div className='flex items-center gap-4 mb-6'>
        <FaInfoCircle className="text-[40px] text-black" />
        <span className='text-lg font-medium tracking-wide'>ABOUT US</span>
        <FaInfoCircle className="text-[40px] text-black" />
      </div>

      {/* Main Title */}
      <div className='text-center max-w-3xl mb-10'>
        <h1 className='text-4xl md:text-5xl font-bold text-black mb-2'>
          JAGAT ACADEMY
        </h1>
        <p className='text-xl text-gray-600 font-medium'>
          Integrated E-Learning Platform
        </p>
      </div>

      {/* Description */}
      <p className='text-center text-gray-600 max-w-2xl mb-12 leading-relaxed'>
        A comprehensive e-learning management system designed to empower educators and students
        with modern tools for seamless online education, progress tracking, and collaboration.
      </p>

      {/* Features Grid - Material UI Icons */}
      <div className='grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6 max-w-5xl mb-12'>

        <div className='flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer'>
          <div className='w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center mb-3'>
            <FaPlayCircle className="text-[32px] text-black" />
          </div>
          <span className='text-sm font-medium text-center'>Quality Courses</span>
        </div>

        <div className='flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer'>
          <div className='w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center mb-3'>
            <FaUsers className="text-[32px] text-black" />
          </div>
          <span className='text-sm font-medium text-center'>Expert Educators</span>
        </div>

        <div className='flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer'>
          <div className='w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center mb-3'>
            <FaChartLine className="text-[32px] text-black" />
          </div>
          <span className='text-sm font-medium text-center'>Progress Tracking</span>
        </div>

        <div className='flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer'>
          <div className='w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center mb-3'>
            <FaMedal className="text-[32px] text-black" />
          </div>
          <span className='text-sm font-medium text-center'>Certifications</span>
        </div>

        <div className='flex flex-col items-center p-4 hover:bg-gray-50 rounded-xl transition cursor-pointer'>
          <div className='w-16 h-16 border-2 border-black rounded-2xl flex items-center justify-center mb-3'>
            <FaHeadset className="text-[32px] text-black" />
          </div>
          <span className='text-sm font-medium text-center'>Live Support</span>
        </div>

      </div>

      {/* Bottom Badges */}
      <div className='flex flex-wrap justify-center gap-6 text-sm'>
        <div className='flex items-center gap-2'>
          <FaCheckCircle className="text-[20px] text-black" />
          <span>Simplified Learning</span>
        </div>
        <div className='flex items-center gap-2'>
          <FaCheckCircle className="text-[20px] text-black" />
          <span>Expert Trainers</span>
        </div>
        <div className='flex items-center gap-2'>
          <FaCheckCircle className="text-[20px] text-black" />
          <span>Lifetime Access</span>
        </div>
        <div className='flex items-center gap-2'>
          <FaCheckCircle className="text-[20px] text-black" />
          <span>24/7 Support</span>
        </div>
      </div>

    </div>
  )
}

export default About
