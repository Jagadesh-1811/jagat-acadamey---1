# Jagat Academy - Learning Management System

**Empowering Learning Through Technology**

Live Demo=https://jagat-acadamey-1-1.onrender.com

**Live Application=https://jagat-acadamey-1-1.onrender.com/

---
## Table of Contents

- [Overview](#overview)
- [Key Features](#key-features)
- [Technology Stack](#technology-stack)
- [System Architecture](#system-architecture)
- [Installation Guide](#installation-guide)
- [Environment Configuration](#environment-configuration)
- [Deployment Instructions](#deployment-instructions)
- [Project Structure](#project-structure)
- [Contributing](#contributing)
- [License](#license)
- [Contact](#contact)

---

## Overview

Jagat Academy is a comprehensive, full-stack Learning Management System (LMS) designed to facilitate seamless digital education. The platform connects educators and students through an intuitive interface, offering course management, assignments, quizzes, payment integration, and AI-powered assistance.

### Core Capabilities

- Complete learning ecosystem with courses, assignments
- AI-powered chatbot for instant doubt resolution
- Secure payment gateway integration via Razorpay
- Responsive design compatible with all devices
- Modern UI/UX with smooth animations
- Role-based access control with JWT authentication
- Cloud-based media storage and delivery

---

## Key Features

### For Educators

**Course Management**
- Create and manage comprehensive courses
- Set course duration, pricing, and descriptions
- Upload course thumbnails and promotional materials

**Content Delivery**
- Upload educational materials (PDFs, PPTs, Videos)
- Preview uploaded content before publishing
- Organize materials by topics and modules

**Student Management**
- View enrolled students
- Track student progress and engagement
- Manage student submissions and grades

**Assessment Tools**
- Create assignments with flexible submission options
- Support for GitHub links and file uploads
- Grade submissions using A-D scale
- Provide detailed feedback to students

**Interactive Sessions**
- Schedule daily doubt-solving sessions
- Share meeting links (Google Meet, Zoom, etc.)
- Create monthly quizzes with rules and guidelines
- Host live Q&A sessions

### For Students

**Course Access**
- Browse available courses
- Enroll using secure payment gateway
- Access course materials anytime
- Download resources for offline learning

**Learning Tools**
- Preview course materials before download
- Submit assignments via multiple methods
- View grades and instructor feedback
- Track learning progress

**Assessment & Rewards**
- Participate in monthly quizzes
- Earn voucher rewards for high performance
- Receive certificates upon course completion
- Download resume templates

**Support System**
- Access AI chatbot for instant doubt resolution
- Join course-specific discussion forums
- Attend scheduled doubt-solving sessions
- Connect with instructors and peers

### Additional Features

- Discussion forums for each course
- Real-time notifications for assignments and quizzes
- Progress tracking dashboard
- Gamification elements (confetti effects on completion)
- Secure authentication and authorization
- Mobile-responsive interface

---

## Technology Stack

### Frontend Technologies

- **React 18** - Modern JavaScript library for building user interfaces
- **Vite** - Next-generation frontend build tool for fast development
- **Tailwind CSS** - Utility-first CSS framework for responsive design
- **Framer Motion** - Production-ready animation library
- **Axios** - Promise-based HTTP client for API requests
- **React Router** - Declarative routing for React applications
- **React Icons** - Popular icon library

### Backend Technologies

- **Node.js** - JavaScript runtime environment
- **Express.js** - Fast, minimalist web framework
- **MongoDB** - NoSQL database for flexible data storage
- **Mongoose** - MongoDB object modeling tool
- **JWT (JSON Web Tokens)** - Secure authentication mechanism
- **Bcrypt** - Password hashing library
- **Multer** - Middleware for file uploads
- **Nodemailer** - Email sending functionality

### Third-Party Services

- **MongoDB Atlas** - Cloud-hosted MongoDB database
- **Cloudinary** - Cloud storage for images, videos, and documents
- **Razorpay** - Payment gateway for course enrollments
- **AI Chatbot API** - Intelligent doubt-solving assistant

### Development Tools

- **Git** - Version control system

---

## System Architecture

The application follows a three-tier architecture pattern:

### Architecture Layers

**Presentation Layer (Frontend)**
- React-based single-page application
- Handles user interface and interactions
- Communicates with backend via REST APIs

**Application Layer (Backend)**
- Express.js server handling business logic
- JWT-based authentication middleware
- RESTful API endpoints
- Integration with external services

**Data Layer**
- MongoDB database for persistent storage
- Cloudinary for media file storage
- Caching for improved performance

### Data Flow

1. User interacts with React frontend
2. Frontend sends HTTP requests to Express backend
3. Backend validates requests using JWT middleware
4. Business logic processes the request
5. Database operations performed via Mongoose
6. External services called when needed (Razorpay, Cloudinary)
7. Response sent back to frontend
8. UI updates based on response data

For detailed architecture diagrams, please refer to:
- `docs/architecture-diagram.md` - System architecture flowchart
- `docs/database-schema.md` - Database entity relationships
- `docs/user-flows.md` - User journey flowcharts

---

## Installation Guide

### Prerequisites

Before installation, ensure you have:
- Node.js version 16.x or higher
- npm or yarn package manager
- MongoDB Atlas account
- Cloudinary account
- Razorpay account (for payment features)
- Git installed on your system

### Step 1: Clone Repository

```bash
git clone https://github.com/Jagadesh-1811/jagat-acadamey---1.git
cd jagat-acadamey---1
```

### Step 2: Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your credentials
# (See Environment Configuration section below)

# Start development server
npm run dev
```

The backend server will start on `http://localhost:5000`

### Step 3: Frontend Setup

```bash
# Navigate to frontend directory (from project root)
cd frontend

# Install dependencies
npm install

# Create environment file
cp .env.example .env

# Edit .env file with your credentials

# Start development server
npm run dev
```

The frontend application will start on `http://localhost:5173`

### Step 4: Verify Installation

- Open browser and navigate to `http://localhost:5173`
- You should see the Jagat Academy landing page
- Try registering a new account to verify database connection
- Check browser console for any errors

---

## Environment Configuration

### Backend Environment Variables

Create a `.env` file in the `backend` directory:

```plaintext
PORT=5000
NODE_ENV=development

MONGODB_URI=your_mongodb_connection_string
DB_NAME=jagat_academy

JWT_SECRET=your_super_secure_jwt_secret_key_here
JWT_EXPIRE=7d
JWT_COOKIE_EXPIRE=7

CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
CLOUDINARY_API_KEY=your_cloudinary_api_key
CLOUDINARY_API_SECRET=your_cloudinary_api_secret

RAZORPAY_KEY_ID=your_razorpay_key_id
RAZORPAY_KEY_SECRET=your_razorpay_key_secret

SMTP_HOST=smtp.gmail.com
SMTP_PORT=587
SMTP_EMAIL=your_email@gmail.com
SMTP_PASSWORD=your_app_specific_password

CHATBOT_API_KEY=your_chatbot_api_key
CHATBOT_API_URL=your_chatbot_api_endpoint

FRONTEND_URL=http://localhost:5173
```

### Frontend Environment Variables

Create a `.env` file in the `frontend` directory:

```plaintext
VITE_API_URL=http://localhost:5000/api
VITE_RAZORPAY_KEY_ID=your_razorpay_key_id
VITE_CLOUDINARY_CLOUD_NAME=your_cloudinary_cloud_name
VITE_CLOUDINARY_UPLOAD_PRESET=your_upload_preset
```

### Obtaining API Keys

**MongoDB Atlas**
1. Create account at mongodb.com
2. Create new cluster
3. Get connection string from "Connect" button

**Cloudinary**
1. Sign up at cloudinary.com
2. Navigate to Dashboard
3. Copy Cloud Name, API Key, and API Secret

**Razorpay**
1. Create account at razorpay.com
2. Go to Settings > API Keys
3. Generate Test/Live keys

---


## Deployment Instructions

### Deploy Backend to Render

1. Create account on Render.com
2. Click "New +" and select "Web Service"
3. Connect your GitHub repository
4. Configure service:
   - **Name:** jagat-academy-backend
   - **Environment:** Node
   - **Build Command:** `cd backend && npm install`
   - **Start Command:** `cd backend && npm start`
5. Add environment variables from your `.env` file
6. Click "Create Web Service"
7. Wait for deployment to complete
8. Copy the deployed URL

### Deploy Frontend to Render

1. Click "New +" and select "Static Site"
2. Connect your GitHub repository
3. Configure site:
   - **Name:** jagat-academy-frontend
   - **Build Command:** `cd frontend && npm install && npm run build`
   - **Publish Directory:** `frontend/dist`
4. Add environment variables:
   - Update `VITE_API_URL` with backend URL
5. Click "Create Static Site"
6. Wait for deployment to complete

### Post-Deployment Steps

1. Update CORS settings in backend to allow frontend domain
2. Update `FRONTEND_URL` in backend environment variables
3. Test all features on deployed application
4. Monitor logs for any errors
5. Set up custom domain (optional)

---

## Project Structure

```
jagat-acadamey---1/
│
├── backend/
│   ├── config/
│   │   └── db.js              # Database configuration
│   ├── controllers/
│   │   ├── authController.js
│   │   ├── courseController.js
│   │   ├── materialController.js
│   │   ├── assignmentController.js
│   │   └── paymentController.js
│   ├── middleware/
│   │   ├── auth.js            # JWT authentication
│   │   ├── errorHandler.js
│   │   └── upload.js          # File upload middleware
│   ├── models/
│   │   ├── User.js
│   │   ├── Course.js
│   │   ├── Material.js
│   │   ├── Assignment.js
│   │   └── Payment.js
│   ├── routes/
│   │   ├── authRoutes.js
│   │   ├── courseRoutes.js
│   │   ├── materialRoutes.js
│   │   ├── assignmentRoutes.js
│   │   └── paymentRoutes.js
│   ├── utils/
│   │   ├── cloudinary.js      # Cloudinary configuration
│   │   └── helpers.js
│   ├── .env
│   ├── server.js
│   └── package.json
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   │   ├── Layout/
│   │   │   ├── Course/
│   │   │   ├── Assignment/
│   │   │   └── Common/
│   │   ├── pages/
│   │   │   ├── Home.jsx
│   │   │   ├── Login.jsx
│   │   │   ├── Register.jsx
│   │   │   ├── Dashboard.jsx
│   │   │   ├── CourseDetail.jsx
│   │   │   └── Profile.jsx
│   │   ├── context/
│   │   │   └── AuthContext.jsx
│   │   ├── services/
│   │   │   └── api.js         # API calls
│   │   ├── utils/
│   │   │   └── helpers.js
│   │   ├── App.jsx
│   │   ├── main.jsx
│   │   └── index.css
│   ├── .env
│   ├── vite.config.js
│   └── package.json
│
├── docs/
│   ├── architecture-diagram.md
│   ├── database-schema.md
│   └── user-flows.md
│
├── .gitignore
├── README.md
└── LICENSE
```

---

## Contributing

Contributions are welcome and appreciated! Here's how you can contribute:

### How to Contribute

1. **Fork the repository**
   - Click the "Fork" button at the top right

2. **Clone your fork**
   ```bash
   git clone https://github.com/your-username/jagat-acadamey---1.git
   cd jagat-acadamey---1
   ```

3. **Create a feature branch**
   ```bash
   git checkout -b feature/YourFeatureName
   ```

4. **Make your changes**
   - Write clean, maintainable code
   - Follow existing code style
   - Add comments where necessary

5. **Test your changes**
   - Ensure all existing tests pass
   - Add new tests for new features

6. **Commit your changes**
   ```bash
   git add .
   git commit -m "Add: Brief description of your changes"
   ```

7. **Push to your fork**
   ```bash
   git push origin feature/YourFeatureName
   ```

8. **Create Pull Request**
   - Go to the original repository
   - Click "New Pull Request"
   - Provide detailed description of changes

### Contribution Guidelines

- Write clear, descriptive commit messages
- Update documentation for new features
- Follow the existing project structure
- Ensure code is properly formatted
- Test thoroughly before submitting PR
- Be respectful and constructive in discussions

---

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.

### MIT License Summary

- Commercial use allowed
- Modification allowed
- Distribution allowed
- Private use allowed
- No liability
- No warranty

---

## Acknowledgments

This project was built using excellent open-source technologies:

- React.js - User interface library
- Express.js - Backend framework
- MongoDB - Database solution
- Cloudinary - Media storage
- Razorpay - Payment gateway
- Tailwind CSS - CSS framework
- Framer Motion - Animation library

Special thanks to the open-source community for their valuable tools and resources.

---

## Support

If you find this project helpful, please consider:
- Giving it a star on GitHub
- Sharing it with others
- Contributing to its development
- Reporting bugs and suggesting features

---

**Made with dedication by Jagadesh**

**© 2025 Jagat Academy. All rights reserved.**
