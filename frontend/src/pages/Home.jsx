import React from 'react'
import home from "../assets/home12.png"
import logo from "../assets/logo.jpg"
import Nav from '../components/Nav'
import PlayCircleOutlinedIcon from '@mui/icons-material/PlayCircleOutlined';
import Logos from '../components/Logos';
import Cardspage from '../components/Cardspage';
import ExploreCourses from '../components/ExploreCourses';
import About from '../components/About';
import ai from '../assets/ai.png'
import ai1 from '../assets/SearchAi.png'
import ReviewPage from '../components/ReviewPage';
import Footer from '../components/Footer';
import { useNavigate } from 'react-router-dom';

function Home() {
  const navigate = useNavigate()

  return (



    <div className='w-[100%] overflow-hidden'>

      {/* Hero Section */}
      <div className='w-full min-h-[100vh] bg-black relative flex flex-col justify-center pt-20 overflow-hidden'>
        <Nav />

        <div className='max-w-7xl mx-auto w-full px-6 lg:px-8 grid lg:grid-cols-2 gap-12 items-center relative z-10 py-12'>

          {/* Left Column: Text & Actions */}
          <div className='flex flex-col items-start text-left space-y-8'>

            {/* Headline */}
            <h1 className='text-5xl md:text-7xl font-bold text-white tracking-tight leading-[1.1] animate-fade-in-up' style={{ animationDelay: '0.1s' }}>
              Unlocking Knowledge <br />
              <span className='text-transparent bg-clip-text bg-gradient-to-r from-gray-200 to-gray-500'>
                At The Speed of Thought
              </span>
            </h1>

            {/* Subheadline */}
            <p className='text-lg md:text-xl text-gray-400 max-w-xl animate-fade-in-up' style={{ animationDelay: '0.2s' }}>
              Join the world's most advanced integrated e-learning platform.
              Master new skills with expert-led courses and AI-driven personalized learning paths.
            </p>

            {/* Search with AI Bar */}
            <div
              className='w-full max-w-xl px-6 py-5 bg-[#111] border border-gray-800 rounded-xl text-white hover:border-white transition-colors cursor-pointer flex items-center gap-4 animate-fade-in-up'
              style={{ animationDelay: '0.3s' }}
              onClick={() => navigate("/searchwithai")}
            >
              <img src={ai} className='w-6 h-6 flex-shrink-0' alt="" />
              <span className='text-lg text-gray-400 flex-1'>What do you want to learn today?</span>
              <span className='text-sm font-semibold text-white bg-white/10 px-4 py-2 rounded-lg'>Search with AI</span>
            </div>

            {/* CTAs */}
            <div className='flex flex-wrap items-center gap-6 animate-fade-in-up' style={{ animationDelay: '0.4s' }}>
              <button
                className='px-8 py-3 bg-white text-black rounded-lg font-medium hover:bg-gray-200 transition-colors'
                onClick={() => navigate("/allcourses")}
              >
                Explore All Courses
              </button>
            </div>
          </div>

          {/* Right Column: Visual */}
          <div className='hidden lg:flex items-center justify-center relative animate-fade-in' style={{ animationDelay: '0.5s' }}>
            {/* Visual Container */}
            <div className='relative w-[500px] h-[500px] flex items-center justify-center'>
              {/* Decorative Circles */}
              <div className='absolute inset-0 border border-gray-800 rounded-full animate-[spin_10s_linear_infinite] opacity-30'></div>
              <div className='absolute inset-4 border border-gray-800 rounded-full animate-[spin_15s_linear_infinite_reverse] opacity-20'></div>
              <div className='absolute inset-16 border border-gray-800 rounded-full animate-[pulse_4s_ease-in-out_infinite] opacity-10'></div>

              {/* Main Logo */}
              <img
                src={logo}
                alt="Jagat Academy Logo"
                className='w-[350px] h-[350px] object-cover rounded-full grayscale opacity-80 shadow-[0_0_50px_rgba(255,255,255,0.1)]'
              />
            </div>
          </div>

        </div>

        {/* Background Gradients */}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent via-transparent to-black pointer-events-none" />
      </div>
      <Logos />
      <ExploreCourses />
      <Cardspage />
      <About />
      <ReviewPage />
      <Footer />

      {/* AI Chatbot - Only on Home Page */}


    </div>

  )
}

export default Home
