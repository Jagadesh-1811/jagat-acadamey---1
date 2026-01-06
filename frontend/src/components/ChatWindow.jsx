import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import {
    FaComments,
    FaTimes,
    FaPaperPlane
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';

const ChatWindow = ({ courseId, educatorName, onClose }) => {
    const { token, userData } = useSelector(state => state.user);
    const [conversation, setConversation] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [sending, setSending] = useState(false);
    const messagesEndRef = useRef(null);
    const inputRef = useRef(null);

    // Initialize conversation
    useEffect(() => {
        initConversation();
    }, [courseId]);

    // Auto-refresh messages every 3 seconds
    useEffect(() => {
        if (conversation) {
            const interval = setInterval(() => {
                fetchMessages(true);
            }, 3000);
            return () => clearInterval(interval);
        }
    }, [conversation]);

    // Scroll to bottom on new messages
    useEffect(() => {
        scrollToBottom();
    }, [messages]);

    const initConversation = async () => {
        try {
            setLoading(true);
            const { data } = await axios.post(
                `${serverUrl}/api/chat/conversation/${courseId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConversation(data.conversation);
            await fetchMessages();
        } catch (error) {
            console.error('Init conversation error:', error);
            toast.error('Failed to start chat');
        } finally {
            setLoading(false);
        }
    };

    const fetchMessages = async (silent = false) => {
        if (!conversation) return;
        try {
            const { data } = await axios.get(
                `${serverUrl}/api/chat/messages/${conversation._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(data.messages);
        } catch (error) {
            if (!silent) console.error('Fetch messages error:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await axios.post(
                `${serverUrl}/api/chat/message`,
                {
                    conversationId: conversation._id,
                    message: newMessage.trim()
                },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, data.message]);
            setNewMessage('');
            inputRef.current?.focus();
        } catch (error) {
            console.error('Send message error:', error);
            toast.error('Failed to send message');
        } finally {
            setSending(false);
        }
    };

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    const formatDate = (date) => {
        const today = new Date();
        const msgDate = new Date(date);
        if (today.toDateString() === msgDate.toDateString()) {
            return 'Today';
        }
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (loading) {
        return (
            <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex items-center justify-center z-50 border border-gray-200">
                <ClipLoader size={40} color="#000" />
            </div>
        );
    }

    return (
        <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden"
            style={{ animation: 'adminFadeIn 0.3s ease-out' }}>

            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-white/20 rounded-full flex items-center justify-center">
                        <FaComments className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-semibold text-sm">Chat with Educator</h3>
                        <p className="text-xs text-gray-300">{educatorName}</p>
                    </div>
                </div>
                <button
                    onClick={onClose}
                    className="p-2 hover:bg-white/10 rounded-full transition-colors"
                >
                    <FaTimes className="w-5 h-5" />
                </button>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.length === 0 ? (
                    <div className="text-center py-10">
                        <div className="w-16 h-16 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-3">
                            <FaComments className="w-8 h-8 text-gray-400" />
                        </div>
                        <p className="text-gray-500 text-sm">No messages yet</p>
                        <p className="text-gray-400 text-xs mt-1">Start the conversation!</p>
                    </div>
                ) : (
                    messages.map((msg, index) => {
                        const isMe = msg.sender._id === userData._id;
                        const showDate = index === 0 ||
                            formatDate(messages[index - 1].createdAt) !== formatDate(msg.createdAt);

                        return (
                            <React.Fragment key={msg._id}>
                                {showDate && (
                                    <div className="text-center">
                                        <span className="text-xs text-gray-400 bg-white px-3 py-1 rounded-full">
                                            {formatDate(msg.createdAt)}
                                        </span>
                                    </div>
                                )}
                                <div className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                                    <div className={`max-w-[75%] ${isMe
                                        ? 'bg-black text-white rounded-2xl rounded-br-md'
                                        : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200'
                                        } px-4 py-2.5 shadow-sm`}>
                                        <p className="text-sm leading-relaxed">{msg.message}</p>
                                        <div className="flex items-center justify-between gap-2 mt-1">
                                            <p className={`text-[10px] ${isMe ? 'text-gray-400' : 'text-gray-400'}`}>
                                                {formatTime(msg.createdAt)}
                                            </p>
                                            {/* Show read status only for student's messages */}
                                            {msg.senderRole === 'student' && (
                                                <p className={`text-[10px] ${msg.isRead ? 'text-green-400' : 'text-gray-400'}`}>
                                                    {msg.isRead ? '✓ Read' : 'Unread'}
                                                </p>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            </React.Fragment>
                        );
                    })
                )}
                <div ref={messagesEndRef} />
            </div>

            {/* Input */}
            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        ref={inputRef}
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your doubt..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20 transition-all"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {sending ? (
                            <ClipLoader size={16} color="white" />
                        ) : (
                            <FaPaperPlane className="w-4 h-4" />
                        )}
                    </button>
                </div>
            </form>

            {/* Keyframes */}
            <style>{`
                @keyframes adminFadeIn {
                    from { opacity: 0; transform: translateY(20px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ChatWindow;
