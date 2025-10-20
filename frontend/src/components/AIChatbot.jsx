import React, { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaRegCommentDots, FaTimes, FaPaperPlane, FaImage } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import { ClipLoader } from 'react-spinners';

const ChatBubble = ({ message, isUser }) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex ${isUser ? 'justify-end' : 'justify-start'} mb-4`}
    >
      <div
        className={`max-w-[75%] px-4 py-3 rounded-2xl ${
          isUser
            ? 'bg-black text-white rounded-br-none'
            : 'bg-gray-200 text-black rounded-bl-none'
        }`}
      >
        {message.image && (
          <img
            src={message.image}
            alt="Uploaded"
            className="max-w-full h-auto rounded-lg mb-2"
          />
        )}
        <p className="text-sm whitespace-pre-wrap break-words">{message.text}</p>
        <span className="text-xs opacity-70 mt-1 block">
          {new Date(message.timestamp).toLocaleTimeString([], {
            hour: '2-digit',
            minute: '2-digit',
          })}
        </span>
      </div>
    </motion.div>
  );
};

const MessageInput = ({ onSend, disabled }) => {
  const [input, setInput] = useState('');
  const [selectedImage, setSelectedImage] = useState(null);
  const [previewUrl, setPreviewUrl] = useState(null);
  const fileInputRef = useRef(null);

  const handleImageSelect = (e) => {
    const file = e.target.files[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        toast.error('Image size should be less than 5MB');
        return;
      }
      if (!file.type.startsWith('image/')) {
        toast.error('Please select a valid image file');
        return;
      }
      setSelectedImage(file);
      setPreviewUrl(URL.createObjectURL(file));
    }
  };

  const handleRemoveImage = () => {
    setSelectedImage(null);
    setPreviewUrl(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() || selectedImage) {
      onSend(input, selectedImage);
      setInput('');
      setSelectedImage(null);
      setPreviewUrl(null);
      if (fileInputRef.current) {
        fileInputRef.current.value = '';
      }
    }
  };

  return (
    <form onSubmit={handleSubmit} className="border-t border-gray-300 p-4">
      {previewUrl && (
        <div className="relative mb-2 inline-block">
          <img
            src={previewUrl}
            alt="Preview"
            className="max-h-20 rounded-lg"
          />
          <button
            type="button"
            onClick={handleRemoveImage}
            className="absolute -top-2 -right-2 bg-black text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-gray-800"
          >
            <FaTimes />
          </button>
        </div>
      )}
      <div className="flex gap-2 items-center">
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleImageSelect}
          accept="image/*"
          className="hidden"
        />
        <button
          type="button"
          onClick={() => fileInputRef.current?.click()}
          disabled={disabled}
          className="p-2 rounded-full bg-gray-200 hover:bg-gray-300 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaImage className="w-5 h-5 text-black" />
        </button>
        <input
          type="text"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Ask me anything..."
          disabled={disabled}
          className="flex-1 px-4 py-2 border border-gray-300 rounded-full focus:outline-none focus:border-black disabled:bg-gray-100 disabled:cursor-not-allowed"
        />
        <button
          type="submit"
          disabled={disabled || (!input.trim() && !selectedImage)}
          className="p-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
        >
          <FaPaperPlane className="w-5 h-5" />
        </button>
      </div>
    </form>
  );
};

const AIChatbot = () => {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);
  const { userData, token } = useSelector((state) => state.user);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  // Load chat history from localStorage on mount
  useEffect(() => {
    if (userData?._id) {
      const savedMessages = localStorage.getItem(`chatHistory_${userData._id}`);
      if (savedMessages) {
        setMessages(JSON.parse(savedMessages));
      }
    }
  }, [userData]);

  // Save chat history to localStorage whenever messages change
  useEffect(() => {
    if (userData?._id && messages.length > 0) {
      localStorage.setItem(`chatHistory_${userData._id}`, JSON.stringify(messages));
    }
  }, [messages, userData]);

  const handleSendMessage = async (text, image) => {
    const userMessage = {
      text: text || (image ? 'Analyzing image...' : ''),
      isUser: true,
      timestamp: new Date().toISOString(),
      image: image ? URL.createObjectURL(image) : null,
    };

    setMessages((prev) => [...prev, userMessage]);
    setIsLoading(true);

    try {
      const formData = new FormData();
      formData.append('message', text);
      if (image) {
        formData.append('image', image);
      }

      const { data } = await axios.post(
        `${serverUrl}/api/ai/chat`,
        formData,
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'multipart/form-data',
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const aiMessage = {
        text: data.response,
        isUser: false,
        timestamp: new Date().toISOString(),
      };

      setMessages((prev) => [...prev, aiMessage]);
    } catch (error) {
      console.error('Error sending message:', error);
      toast.error(error.response?.data?.message || 'Failed to get AI response');

      const errorMessage = {
        text: 'Sorry, I encountered an error. Please try again.',
        isUser: false,
        timestamp: new Date().toISOString(),
      };
      setMessages((prev) => [...prev, errorMessage]);
    } finally {
      setIsLoading(false);
    }
  };

  const clearChat = () => {
    setMessages([]);
    if (userData?._id) {
      localStorage.removeItem(`chatHistory_${userData._id}`);
    }
  };

  // Only show for students
  if (!userData || userData.role !== 'student') {
    return null;
  }
  return (
    <>
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, scale: 0.8, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.8, y: 20 }}
            transition={{ duration: 0.3, ease: 'easeOut' }}
            className="fixed bottom-24 right-6 w-[380px] h-[600px] bg-white rounded-2xl shadow-2xl border border-gray-200 flex flex-col z-50 overflow-hidden"
          >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <FaRegCommentDots className="w-5 h-5" />
                <h3 className="font-semibold">JAGAT Assistant</h3>
              </div>
              <div className="flex items-center gap-2">
                {messages.length > 0 && (
                  <button
                    onClick={clearChat}
                    className="text-xs px-2 py-1 bg-white text-black rounded hover:bg-gray-200 transition-colors"
                  >
                    Clear
                  </button>
                )}
                <button
                  onClick={() => setIsOpen(false)}
                  className="hover:bg-gray-800 p-1 rounded transition-colors"
                >
                  <FaTimes className="w-5 h-5" />
                </button>
              </div>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 bg-gray-50">
              {messages.length === 0 && (
                <div className="flex flex-col items-center justify-center h-full text-center">
                  <FaRegCommentDots className="w-16 h-16 text-gray-300 mb-4" />
                  <h4 className="text-lg font-semibold text-gray-700 mb-2">
                    Welcome to JAGAT Assistant
                  </h4>
                  <p className="text-sm text-gray-500 px-6">
                    Ask me anything about your courses, assignments, or upload an
                    image for analysis!
                  </p>
                </div>
              )}
              {messages.map((msg, index) => (
                <ChatBubble key={index} message={msg} isUser={msg.isUser} />
              ))}
              {isLoading && (
                <div className="flex justify-start mb-4">
                  <div className="bg-gray-200 px-4 py-3 rounded-2xl rounded-bl-none">
                    <ClipLoader size={20} color="#000" />
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <MessageInput onSend={handleSendMessage} disabled={isLoading} />
          </motion.div>
        )}
      </AnimatePresence>

      {/* Message Button */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.1 }}
        whileTap={{ scale: 0.95 }}
        className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full shadow-2xl flex items-center justify-center z-50 hover:bg-gray-800 transition-colors"
      >
        <motion.div
          animate={{ rotate: isOpen ? 180 : 0 }}
          transition={{ duration: 0.3 }}
        >
          {isOpen ? <FaTimes className="w-6 h-6" /> : <FaRegCommentDots className="w-6 h-6" />}
        </motion.div>
      </motion.button>
    </>
  );
};

export default AIChatbot;
