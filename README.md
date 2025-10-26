deployment link 
is https://jagat-acadamey-1-1.onrender.com/

# 🏫 Jagat Academy – Full-Stack Learning Management System (LMS)

**Jagat Academy** is a modern, full-stack Learning Management System (LMS) built to empower digital learning with interactive features, secure authentication, responsive design, and an AI-powered chatbot for students. It supports course management, assignments, quizzes, payments, and doubt-solving sessions to create a seamless educational experience.

---

## 🚀 Tech Stack

### **Frontend**
- ⚛️ React + Vite  
- 🎨 Tailwind CSS for modern responsive UI  
- 🎞️ Framer Motion for animations (transitions, hover effects, confetti effects)

### **Backend**
- 🟢 Node.js + Express  
- 🔐 RESTful APIs with JWT authentication  
- 💳 Razorpay for payment integration  
- ☁️ Deployment: Render

### **Database & Storage**
- 🗄️ MongoDB (Mongoose ORM) for data persistence  
- 🖼️ Cloudinary for storing PDFs, PPTs, videos, and thumbnails  

### **Integrations**
- 💬 AI Chatbot for students (doubt-solving only, no chat history stored)  
- 💵 Razorpay Payment Gateway for enrollments  
- 🧑‍🏫 Doubt-solving session and quiz link management by teachers  

---

## 🧠 Core Features

### 👩‍🏫 **Teacher Role**
- Create and manage courses (title, description, duration, thumbnail)  
- Upload course materials (PDFs, PPTs, videos) using Cloudinary  
- Preview uploaded materials  
- Manage enrolled students  
- Create assignments for specific courses  
- Allow assignment submission via file or GitHub link  
- Review submissions and grade students (A–D scale)  
- Schedule daily Doubt-Solving Sessions  with meeting links (Google Meet, Zoom, etc.)  
- Create **Monthly Quizzes** with rules and live session links (on 30th/31st of each month)  

---

### 🎓 **Student Role**
- Register and log in securely  
- Browse and enroll in available courses using Razorpay  
- Access uploaded course materials with **preview/download options**  
- Submit assignments using a GitHub link or file upload  
- View assignment grades and teacher feedback  
- Participate in **Monthly Quizzes** (20 questions, 18 correct = ₹500 voucher)  
- Attend Doubt-Solving Sessions  via teacher-provided link  
- Use integrated **AI Chatbot** for real-time doubt clarification (no history stored)

---

## 💬 Discussion Forum
Each course includes a **Discussion Forum** for students and teachers to collaborate, share response.

---

## 📅 Quiz System
- 🗓️ Conducted on the **last day of every month (30th or 31st)** except February   
- Teachers can post quiz links and instructions in their dashboard  
- Students can access quizzes from their dashboard and click **“Start Quiz”**  

---

## 💰 Payment Integration
- Integrated with **Razorpay** for secure student course enrollments  
- Payment confirmation automatically updates the student’s enrolled course list  

---

## 🧩 System Architecture

**Frontend (React + Vite)** ↔ **Backend (Node.js + Express)** ↔ **Database (MongoDB)**  
- File uploads handled by **Cloudinary**  
- Payments via **Razorpay API**  
- Real-time role-based actions and routing  
- AI Chatbot integrated in student dashboard  
- Doubt session and quiz links dynamically managed by teachers  

---

## ⚙️ Deployment

| Service | Platform |
|----------|-----------|
| Frontend | Render  |
| Backend | Render |
| Database | MongoDB Atlas |
| File Storage | Cloudinary |

---

## 🔒 Security
- JWT-based authentication  
- Role-based access (Student / Educator )  
- Input validation for file uploads and forms  
- Razorpay-secured transactions  
- No chatbot conversation history stored  

---

## 🎉 Animation & UX
- Smooth UI transitions using **Framer Motion**  
- **Confetti animation** on course completion  
- Animated progress bars and dashboard statistics  

---

## 🧠 AI Chatbot (Students Only)
- Integrated chatbot for real-time doubt-solving  
- Available in the student dashboard  
- Does **not** store any chat history  
- Lightweight and responsive  

---


© 2025 Jagat Academy. All rights reserved.
Empowering Learning Through Technology.
deployment link 
is https://jagat-acadamey-1-1.onrender.com/
