# AI Chatbot Feature

## Overview
An intelligent AI-powered chatbot exclusively for students, featuring text and image analysis capabilities using Google's Gemini AI.

**📍 Location:** The chatbot appears only on the **Home page** for authenticated students.

## Features

### 🌙 Moon-Shaped Button
- Fixed at bottom-right corner of the screen
- Smooth Framer Motion animations
- Only visible to authenticated students
- Transforms into chat panel when clicked

### 💬 Chat Capabilities
- **Text-based Q&A**: Ask questions about courses, assignments, or any educational topic
- **Image Analysis**: Upload images for AI to read, analyze, and explain content
- Real-time AI responses
- Chat history persistence (localStorage)
- Clear chat functionality

### 🎨 Design
- Black and white Tailwind CSS theme
- Responsive design (380px × 600px chat panel)
- Smooth animations with Framer Motion
- Clean, modern UI with reusable components

### 🔒 Security
- Student-only access (role-based authentication)
- API key stored securely in backend `.env`
- All requests routed through backend
- Authentication required for all chat operations

## Technical Implementation

### Frontend Components

#### `AIChatbot.jsx`
Main chatbot component with:
- Moon button toggle
- Chat panel with Framer Motion animations
- Role-based rendering (students only)
- Chat history management

#### `ChatBubble`
Reusable message bubble component:
- User/AI message differentiation
- Image preview support
- Timestamp display

#### `MessageInput`
Input component with:
- Text input field
- Image upload button
- Image preview with remove option
- Send button with loading state
- 5MB image size limit

### Backend Implementation

#### `aiChatController.js`
Handles AI chat requests:
- `chat()`: Main handler for text/image requests
- `chatWithAI()`: Text-only responses using `gemini-pro`
- `chatWithImage()`: Image analysis using `gemini-pro-vision`

#### `aiChatRoute.js`
Protected route with:
- Authentication middleware (`isAuth`)
- Multer for image uploads (memory storage)
- File size and type validation

### API Endpoints

**POST** `/api/ai/chat`
- **Authentication**: Required
- **Content-Type**: `multipart/form-data`
- **Body**:
  - `message` (string, optional): User's text message
  - `image` (file, optional): Image file (max 5MB)
- **Response**:
  ```json
  {
    "success": true,
    "response": "AI generated response text"
  }
  ```

## Setup Instructions

### 1. Install Dependencies

**Frontend:**
```powershell
cd frontend
npm install framer-motion
```

**Backend:**
```powershell
cd backend
npm install @google/generative-ai
```

### 2. Environment Configuration

The `GEMINI_API_KEY` is already configured in `backend/.env`:
```
GEMINI_API_KEY=AIzaSyCmbGq4SXqaM8OvrXuAzoI9H2Uv9R9Xi4I
```

### 3. Integration

The chatbot is integrated in `Home.jsx` and appears **only on the home page** for authenticated students.

## Usage

### For Students

1. **Open Chatbot**
   - Click the moon icon at bottom-right
   - Chat panel slides in smoothly

2. **Send Text Message**
   - Type your question
   - Press Enter or click send button

3. **Upload Image**
   - Click image icon
   - Select image file (max 5MB)
   - Add optional text description
   - Click send

4. **Clear Chat**
   - Click "Clear" button in header
   - Confirms before clearing history

### For Developers

**Customize AI Context:**
Edit the system prompt in `aiChatController.js`:
```javascript
const prompt = `You are an AI assistant for a Learning Management System...`;
```

**Adjust Chat Panel Size:**
Modify dimensions in `AIChatbot.jsx`:
```javascript
className="... w-[380px] h-[600px] ..."
```

**Change Theme:**
Update Tailwind classes for different color schemes.

## Components Architecture

```
AIChatbot (Main Component)
├── Moon Button (Toggle)
├── Chat Panel (AnimatePresence)
│   ├── Header (Title + Clear + Close)
│   ├── Messages Container
│   │   ├── ChatBubble (User)
│   │   ├── ChatBubble (AI)
│   │   └── Loading Spinner
│   └── MessageInput
│       ├── Image Upload Button
│       ├── Text Input
│       └── Send Button
```

## Security Considerations

1. **API Key Protection**: Never expose API key to client-side
2. **Authentication**: All requests require valid session
3. **File Validation**: Size and type checks on uploads
4. **Rate Limiting**: Consider adding rate limits for production
5. **Input Sanitization**: Messages sanitized before processing

## Future Enhancements

- [ ] Voice input support
- [ ] File attachments (PDFs, documents)
- [ ] Context-aware responses based on current course
- [ ] Chat export functionality
- [ ] Multi-language support
- [ ] Response quality feedback

## Troubleshooting

### Chatbot Not Appearing
- Check user role is "student"
- Verify authentication token is valid
- Check browser console for errors

### Image Upload Fails
- Ensure image is under 5MB
- Check file type is valid image format
- Verify multer configuration

### AI Response Errors
- Verify GEMINI_API_KEY in backend `.env`
- Check API quota/limits
- Review backend console logs

## Files Created/Modified

### Created:
- `frontend/src/components/AIChatbot.jsx`
- `backend/controllers/aiChatController.js`
- `backend/routes/aiChatRoute.js`

### Modified:
- `frontend/src/pages/Home.jsx` (imported and added AIChatbot - **Home page only**)
- `backend/index.js` (registered aiChatRoute)

## Dependencies Added

**Frontend:**
- `framer-motion@latest` - Smooth animations

**Backend:**
- `@google/generative-ai@latest` - Google Gemini AI SDK

## License
Part of the LMS project.
