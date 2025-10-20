# 🚀 Quick Start Guide - AI Chatbot

## ✅ Implementation Complete!

All files have been created and integrated successfully. Follow these steps to test the AI Chatbot feature.

## 📍 Important: Chatbot Location

**⚠️ The AI chatbot moon button ONLY appears on the Home page!**

- ✅ Visible on Home page (`/`) for students
- ❌ Does NOT appear on other pages
- ✅ Fixed at bottom-right corner
- ✅ Follows you as you scroll on home page

## 🎯 What's Been Implemented

✅ Moon-shaped circular button (bottom-right corner)
✅ Framer Motion animations for smooth transitions
✅ Text and image upload capabilities
✅ Black-and-white Tailwind CSS theme
✅ Backend AI route with secure API key storage
✅ Student-only access with role-based authentication
✅ Chat history persistence
✅ Real-time AI responses using Google Gemini

## 📦 Dependencies Installed

**Frontend:**
- ✅ `framer-motion` - Installed

**Backend:**
- ✅ `@google/generative-ai` - Installed

## 🏃 How to Run

### 1. Start Backend Server
```powershell
cd d:\LMS\backend
npm run dev
```
Server will start on: `http://localhost:8000`

### 2. Start Frontend Development Server
```powershell
cd d:\LMS\frontend
npm run dev
```
Frontend will start on: `http://localhost:5173`

### 3. Test the Chatbot

1. **Login as a Student**
   - Navigate to `http://localhost:5173`
   - Login with a student account
   
2. **Navigate to Home Page**
   - Make sure you're on the home page (`/`)
   - The chatbot only appears here!
   
3. **Look for Moon Button**
   - Bottom-right corner of screen
   - Black circular button with moon icon

3. **Open Chatbot**
   - Click the moon button
   - Chat panel smoothly expands

4. **Try Text Chat**
   - Type: "Explain quantum physics"
   - Press Enter or click send

5. **Try Image Upload**
   - Click image icon (camera)
   - Upload an image (max 5MB)
   - Add optional text like "What's in this image?"
   - Click send

## 🎨 Features to Test

### ✨ Animations
- Click moon button → Smooth expansion
- Send message → Fade-in animation
- Close panel → Smooth collapse

### 💬 Chat Functions
- Text-only questions
- Image upload with text
- Image-only upload
- Clear chat button
- Chat history persistence (refresh page)

### 🔒 Security
- Only students can see the chatbot
- Try logging in as educator → Chatbot won't appear
- Logout → Chatbot disappears

## 📱 Responsive Design

The chatbot is optimized for:
- **Desktop**: Full-size panel (380px × 600px)
- **Mobile**: Adapts to screen size
- **Tablet**: Responsive layout

## 🎯 User Flow

```
1. Student logs in
   ↓
2. Moon button appears (bottom-right)
   ↓
3. Click moon → Chat panel opens
   ↓
4. Type message OR upload image
   ↓
5. AI responds in real-time
   ↓
6. Continue conversation
   ↓
7. Click X or moon to close
```

## 🐛 Troubleshooting

### Chatbot Not Showing?
**Check:**
- User is logged in
- User role is "student" (not "educator")
- Browser console for errors

**Fix:**
```javascript
// In Redux state, user should have:
{
  role: "student", // ← Must be "student"
  _id: "...",
  name: "..."
}
```

### AI Not Responding?
**Check:**
- Backend server is running
- GEMINI_API_KEY in `backend/.env`
- Network tab for failed requests

**Fix:**
```powershell
# Restart backend
cd d:\LMS\backend
npm run dev
```

### Image Upload Fails?
**Check:**
- Image size < 5MB
- Valid image format (jpg, png, gif, webp)
- File input is clickable

### Chat History Not Saving?
**Check:**
- Browser localStorage is enabled
- User is authenticated
- Browser console for localStorage errors

## 🎨 Customization Options

### Change Moon Button Position
Edit `AIChatbot.jsx`:
```javascript
// Change from bottom-right to bottom-left
className="fixed bottom-6 left-6 ..."
```

### Change Chat Panel Size
Edit `AIChatbot.jsx`:
```javascript
// Make it larger
className="... w-[450px] h-[700px] ..."
```

### Change Color Theme
Edit `AIChatbot.jsx`:
```javascript
// Header - change from black to blue
className="bg-blue-600 text-white ..."

// User messages - change from black to blue
className="bg-blue-600 text-white ..."
```

### Modify AI Context
Edit `backend/controllers/aiChatController.js`:
```javascript
const prompt = `You are a friendly AI tutor specializing in [YOUR SUBJECT].
Help students understand complex topics...`;
```

## 📊 API Usage

### Endpoint
```
POST /api/ai/chat
```

### Authentication
Required - User must be logged in

### Request Format
```javascript
// Text only
FormData {
  message: "What is JavaScript?"
}

// With image
FormData {
  message: "Explain this diagram",
  image: File
}
```

### Response Format
```json
{
  "success": true,
  "response": "JavaScript is a programming language..."
}
```

## 🔐 Security Notes

✅ API key stored in backend `.env` (never exposed)
✅ All requests authenticated
✅ Student-only access enforced
✅ File size limits enforced (5MB)
✅ File type validation
✅ Memory storage (no files saved to disk)

## 📝 Testing Checklist

- [ ] Backend server running
- [ ] Frontend server running
- [ ] Login as student
- [ ] Moon button visible
- [ ] Click moon → Panel opens
- [ ] Send text message → AI responds
- [ ] Upload image → AI analyzes
- [ ] Clear chat works
- [ ] Close panel works
- [ ] Reopen → History restored
- [ ] Logout → Button disappears
- [ ] Login as educator → No button

## 🎉 Success Indicators

✅ Moon button appears bottom-right
✅ Smooth animations on open/close
✅ Messages send and receive
✅ Images upload and analyze
✅ Chat history persists
✅ Only students can access

## 📞 Support

If you encounter issues:
1. Check browser console (F12)
2. Check backend terminal logs
3. Review `AI_CHATBOT_DOCUMENTATION.md`
4. Verify all dependencies installed

## 🚀 Next Steps

The chatbot is ready to use! Consider:
- Testing with real student accounts
- Trying different types of questions
- Uploading various image types
- Checking response quality
- Gathering user feedback

## 📄 Related Files

**Frontend:**
- `frontend/src/components/AIChatbot.jsx`
- `frontend/src/App.jsx`

**Backend:**
- `backend/controllers/aiChatController.js`
- `backend/routes/aiChatRoute.js`
- `backend/index.js`
- `backend/.env` (GEMINI_API_KEY)

**Documentation:**
- `AI_CHATBOT_DOCUMENTATION.md`
- `QUICK_START_AI_CHATBOT.md` (this file)

---

**Status:** ✅ Ready for Testing
**Last Updated:** October 20, 2025
