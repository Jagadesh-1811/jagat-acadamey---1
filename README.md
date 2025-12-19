# Jagat Academy - Learning Management System

**Empowering Learning Through Technology**

Live Demo=https://jagat-acadamey-1-1.onrender.com


##  Table of Contents


- [Overview](#-overview)
- [Key Features](#-key-features)
- [Technology Stack](#-technology-stack)
- [System Architecture](#-system-architecture)
- [Screenshots](#-screenshots)
- [Getting Started](#-getting-started)
- [Prerequisites](#prerequisites)
- [Installation](#installation)
- [Project Structure](#-project-structure)
- [Deployment](#-deployment)
- [Contributing](#-contributing)
- [License](#-license)



---


##  Overview


**Jagat Academy** is a comprehensive, production-ready Learning Management System designed to bridge the gap between educators and students through an intuitive, feature-rich digital platform. Built with modern web technologies, it offers a complete ecosystem for online education with advanced features like AI-powered doubt resolution, real-time voice communication, secure payments, and comprehensive course management.


###  Project Goals


- Provide educators with powerful tools to create and manage courses
- Offer students an engaging, interactive learning experience
- Enable seamless communication through AI chatbot and live voice rooms
- Ensure secure payment processing for course enrollments
- Deliver a responsive, accessible platform across all devices


---


##  Key Features


###  For Educators


#### Course Management
-  Create unlimited courses with rich descriptions
-  Upload course thumbnails and promotional materials
-  Set pricing, difficulty levels (Beginner/Intermediate/Advanced)
-  Publish/unpublish courses with one click
-  Track enrolled students and engagement metrics


#### Content Delivery
-  Upload educational materials (PDFs, PPTs, Videos)
-  Create structured lectures with video content
-  Preview content before publishing
-  Organize materials by topics and modules
-  Cloud-based storage via Cloudinary


#### Assessment Tools
-  Create assignments with flexible submission options
-  Support GitHub links and file uploads
-  Grade submissions using A-D scale
-  Provide detailed feedback to students
-  Monthly quizzes with rules and guidelines


#### Interactive Sessions
-  Schedule daily doubt-solving sessions
-  Share meeting links (Google Meet, Zoom, etc.)
-  Real-time voice rooms (ZegoCloud integration)
-  Weekend-only voice call availability
-  Manage student call requests


###  For Students


#### Learning Experience
-  Browse comprehensive course catalog
-  Enroll via secure Razorpay payment gateway
-  Access all course materials 24/7
-  Download resources for offline learning
-  Track learning progress with dashboard


#### Interactive Tools
-  **AI Chatbot** for instant doubt resolution (Google Gemini)
-  Submit assignments via multiple methods
-  View grades and instructor feedback
-  Participate in monthly quizzes
-  Join live voice rooms on weekends


#### Engagement & Rewards
- Earn certificates upon course completion
-  Win voucher rewards for high quiz performance
-  Leave course reviews and ratings
-  Download resume templates
-  Gamification elements (confetti animations)


###  For Administrators


#### Dashboard & Analytics
-  Real-time statistics (students, educators, revenue)
-  User activity feed and enrollment trends
-  Visual analytics with Recharts
-  Feedback and issue management
-  Voice room monitoring
-  Doubt session oversight


###  Advanced Features


- ** Real-Time Voice Rooms** -ZegoCloud UIKit SDK for pre-built voice room interface
- ** AI-Powered Chat** - Google Generative AI for instant doubt resolution for students only
- ** Secure Payments** - Razorpay integration (Test Mode) with Order Status Verification
- ** Multi-Auth** - JWT, Google OAuth, OTP-based reset
- ** Responsive Design** - Tailwind CSS with mobile-first approach
- ** Smooth Animations** - Framer Motion for enhanced UX


---


##  Technology Stack


### Frontend


| Technology | Purpose | 
|-----------|---------|
| **React** | UI Library | 
| **Vite** | Build Tool | 
| **Redux Toolkit** | State Management |
| **React Router** | Routing | 
| **Tailwind CSS** | Styling | 
| **Framer Motion** | Animations | 
| **Axios** | HTTP Client | 
| **Firebase** | Authentication | 
| **ZegoCloud UIKit** | Voice Rooms | 
| **Recharts** | Data Visualization | 


### Backend


| Technology | Purpose | 
|-----------|---------|
| **Node.js** | Runtime | 
| **Express.js** | Web Framework | 
| **MongoDB** | Database | 
| **Mongoose** | ODM | 
| **JWT** | Authentication | 
| **Bcrypt** | Password Hashing | 
| **Multer** | File Upload | 
| **Nodemailer** | Email Service | 
| **Razorpay** | Payment Gateway |
| **Cloudinary** | Media Storage | 
| **Google Generative AI** | AI Chatbot | 


### Third-Party Services


- **MongoDB Atlas** - Cloud-hosted NoSQL database
- **Cloudinary** - Media storage 
- **Razorpay** - Payment gateway for course enrollments
- **Google Gemini AI** - AI-powered chatbot
- **ZegoCloud** - Real-time voice communication
- **Render.com** - Hosting and deployment


---


##  System Architecture


```
┌─────────────────────────────────────────────────────────┐
│                  PRESENTATION LAYER                      │
│   React 19 + Vite + Redux Toolkit + React Router        │
│   (Tailwind CSS, Framer Motion, Firebase Auth)          │
└────────────────────┬────────────────────────────────────┘
                     │ REST APIs (HTTPS)
┌────────────────────┴────────────────────────────────────┐
│                  APPLICATION LAYER                       │
│   Node.js + Express.js                                   │
│   • JWT Authentication Middleware                        │
│   • 18 Business Logic Controllers                        │
│   • Razorpay Payment Integration                         │
│   • ZegoCloud Token Generation                           │
│   • Google AI Integration                                │
│                                                          │
└────────────────────┬────────────────────────────────────┘
                     │ Mongoose ODM
┌────────────────────┴────────────────────────────────────┐
│                     DATA LAYER                           │
│   • MongoDB Atlas (17 Collections)                       │
│   • Cloudinary (Media Storage)                           │
│   • ZegoCloud Infrastructure                             │
└─────────────────────────────────────────────────────────┘
```


### Architecture Highlights


- **Three-Tier Architecture** for scalability and maintainability
- **RESTful API Design** with 100+ endpoints across 18 route groups
- **Role-Based Access Control** (Student, Educator, Admin)
- **Stateless Authentication** using JWT with 7-day expiry
- **Cloud-Native** with MongoDB Atlas and Cloudinary CDN


---


##  Screenshots


*Coming Soon - Screenshots of the application will be added here*


---


## 🚀 Getting Started


### Prerequisites


Before you begin, ensure you have the following installed:


- **Node.js** (v16.x or higher) - [Download](https://nodejs.org/)
- **npm** or **yarn** - Package manager
- **Git** - Version control
- **MongoDB Atlas Account** - [Sign up](https://www.mongodb.com/cloud/atlas)
- **Cloudinary Account** - [Sign up](https://cloudinary.com/)
- **Razorpay Account** - [Sign up](https://razorpay.com/) (for payment features)


### Installation


#### Clone the Repository


```bash
git clone https://github.com/Jagadesh-1811/jagat-acadamey---1.git
cd jagat-acadamey---1
```


####  Backend Setup


```bash
# Navigate to backend directory
cd backend


# Install dependencies
npm install


# Create .env file (see Environment Variables section below)
# Copy your environment variables


# Start development server
npm run dev
```


The backend server will start on `http://localhost:5000`


####  Frontend Setup


```bash
# Navigate to frontend directory (from project root)
cd frontend


# Install dependencies
npm install


# Create .env file (see Environment Variables section below)
# Copy your environment variables


# Start development server
npm run dev
```


The frontend application will start on `http://localhost:5173`


---




## 📂 Project Structure


```
jagat-acadamey---1/
├── backend/
│   ├── configs/
│   │   ├── db.js                  # MongoDB connection
│   │   ├── Mail.js                # Email configuration (Brevo)
│   │   ├── cloudinary.js          # Cloudinary setup
│   │   └── token.js               # JWT token generation
│   ├── controllers/               # Business logic (18 controllers)
│   │   ├── authController.js
│   │   ├── userController.js
│   │   ├── courseController.js
│   │   ├── voiceRoomController.js # ZegoCloud integration
│   │   ├── aiChatController.js    # Google AI chatbot
│   │   ├── adminController.js
│   │   └── ... (more controllers)
│   ├── models/                    # Mongoose schemas (17 models)
│   │   ├── userModel.js
│   │   ├── courseModel.js
│   │   ├── voiceRoomModel.js
│   │   ├── callRequestModel.js
│   │   └── ... (more models)
│   ├── routes/                    # Express routes (18 route files)
│   │   ├── authRoute.js
│   │   ├── courseRoute.js
│   │   ├── voiceRoomRoute.js
│   │   └── ... (more routes)
│   ├── middlewares/
│   │   └── auth.js                # JWT authentication middleware
│   ├── index.js                   # Express server entry point
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/            # Reusable components
│   │   │   ├── VoiceRoom.jsx
│   │   │   ├── AIChatbot.jsx
│   │   │   ├── Footer.jsx
│   │   │   └── ... (more components)
│   │   ├── pages/                 # Route pages
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── ViewCourse.jsx
│   │   │   ├── admin/
│   │   │   │   ├── AdminDashboard.jsx
│   │   │   │   └── AdminVoiceMonitor.jsx
│   │   │   └── teacher/
│   │   │       ├── Dashboard.jsx
│   │   │       └── CreateCourse.jsx
│   │   ├── redux/                 # Redux Toolkit slices
│   │   │   ├── store.js
│   │   │   ├── userSlice.js
│   │   │   ├── courseSlice.js
│   │   │   └── ... (more slices)
│   │   ├── customHooks/           # Custom React hooks
│   │   ├── utils/
│   │   │   └── Firebase.js        # Firebase configuration
│   │   ├── App.jsx                # Main app component
│   │   ├── main.jsx               # React entry point
│   │   └── index.css              # Global styles
│   ├── package.json
│   └── vite.config.js
│
├── README.md
└── LICENSE
```


---








##  Deployment


### Backend Deployment (Render.com)


1. **Create a Web Service on Render**
   - Connect your GitHub repository
   - Select the `backend` directory


2. **Configure Build Settings**
   ```
   Build Command: cd backend && npm install
   Start Command: cd backend && npm start
   ```


3. **Add Environment Variables**
   - Add all variables from the `.env` file
   - Set `NODE_ENV=production`


4. **Deploy**
   - Click "Create Web Service"
   - Copy the deployed URL


### Frontend Deployment (Render/Firebase)


#### Option 1: Render (Static Site)
1. Create a Static Site on Render
2. Configure:
   ```
   Build Command: cd frontend && npm install && npm run build
   Publish Directory: frontend/dist
   ```
3. Add environment variables
4. Deploy


#### Option 2: Firebase Hosting
```bash
cd frontend
npm install -g firebase-tools
firebase login
firebase init hosting
npm run build
firebase deploy
```


#
##  Contributing


Contributions are welcome! Here's how you can help:


### How to Contribute


1. **Fork the repository**
2. **Create a feature branch**
   ```bash
   git checkout -b feature/AmazingFeature
   ```
3. **Commit your changes**
   ```bash
   git commit -m 'Add some AmazingFeature.'
   ```
4. **Push to the branch**
   ```bash
   git push origin feature/AmazingFeature
   ```
5. **Open a Pull Request**


### Contribution Guidelines


- Write clean, maintainable code
- Follow existing code style and conventions
- Add comments for complex logic
- Update documentation for new features
- Test thoroughly before submitting PR
- Be respectful in discussions


---


##  License


This project is licensed under the **MIT License** - see the [LICENSE](LICENSE) file for details.


### MIT License Summary


 Commercial use allowed  
 Modification allowed  
 Distribution allowed  
 Private use allowed  
 No liability  
 No warranty


---


##  Acknowledgments


This project was built using excellent open-source technologies:


- **React.js** - UI library
- **Express.js** - Backend framework
- **MongoDB** - Database
- **Tailwind CSS** - Styling framework
- **Framer Motion** - Animation library
- **ZegoCloud** - Real-time communication
- **Google Gemini AI** - AI capabilities
- **Razorpay** - Payment processing
- **Cloudinary** - Media storage


Special thanks to the open-source community for their amazing tools and resources.


---




##  Support


If you find this project helpful, please consider:


-  Giving it a star on GitHub
-  Reporting bugs and suggesting features
-  Sharing it with others
-  Contributing to its development


---




---






**Made with ❤️ by Jagadesh**


**© 2025 Jagat Academy. All rights reserved.**







