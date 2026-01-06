import React, { useState, useEffect } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import ChatBubbleOutlineIcon from '@mui/icons-material/ChatBubbleOutline';
import FiberManualRecordIcon from '@mui/icons-material/FiberManualRecord';
import CloseIcon from '@mui/icons-material/Close';
import { ClipLoader } from 'react-spinners';
import ChatWindow from './ChatWindow';

const ChatList = () => {
    const { token, userData } = useSelector(state => state.user);
    const [conversations, setConversations] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedConversation, setSelectedConversation] = useState(null);
    const [isOpen, setIsOpen] = useState(false);

    // Debug: Check if component mounts
    console.log('ChatList mounted, token:', token ? 'exists' : 'missing');


    useEffect(() => {
        if (isOpen) {
            fetchConversations();
            const interval = setInterval(fetchConversations, 5000);
            return () => clearInterval(interval);
        }
    }, [isOpen]);

    const fetchConversations = async () => {
        try {
            const { data } = await axios.get(
                `${serverUrl}/api/chat/conversations`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setConversations(data.conversations);
        } catch (error) {
            console.error('Fetch conversations error:', error);
        } finally {
            setLoading(false);
        }
    };

    const totalUnread = conversations.reduce((sum, conv) => sum + (conv.unreadCount || 0), 0);

    const formatTime = (date) => {
        const now = new Date();
        const msgDate = new Date(date);
        const diffMs = now - msgDate;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return 'now';
        if (diffMins < 60) return `${diffMins}m`;
        if (diffHours < 24) return `${diffHours}h`;
        if (diffDays < 7) return `${diffDays}d`;
        return msgDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    };

    if (selectedConversation) {
        return (
            <div className="fixed bottom-4 right-4 w-96 h-[500px] bg-white rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-200 overflow-hidden"
                style={{ animation: 'adminFadeIn 0.3s ease-out' }}>

                {/* Header */}
                <div className="bg-black text-white p-4 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                        {selectedConversation.otherUser?.photoUrl ? (
                            <img
                                src={selectedConversation.otherUser.photoUrl}
                                alt=""
                                className="w-10 h-10 rounded-full object-cover"
                            />
                        ) : (
                            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-gray-400 to-gray-600 flex items-center justify-center text-white font-bold text-lg">
                                {selectedConversation.otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                            </div>
                        )}
                        <div>
                            <h3 className="font-semibold text-sm">{selectedConversation.otherUser?.name}</h3>
                            <p className="text-xs text-gray-300">{selectedConversation.course?.title}</p>
                        </div>
                    </div>
                    <button
                        onClick={() => setSelectedConversation(null)}
                        className="p-2 hover:bg-white/10 rounded-full transition-colors"
                    >
                        <CloseIcon className="w-5 h-5" />
                    </button>
                </div>

                {/* Messages - Inline version */}
                <EducatorChatMessages
                    conversation={selectedConversation}
                    token={token}
                    userData={userData}
                />
            </div>
        );
    }

    return (
        <>
            {/* Floating Button - Always visible */}
            <button
                onClick={() => setIsOpen(!isOpen)}
                className="fixed bottom-6 right-6 w-16 h-16 bg-black text-white rounded-full shadow-2xl hover:bg-gray-800 transition-all duration-300 flex items-center justify-center hover:scale-110"
                style={{ zIndex: 9999 }}
            >
                <ChatBubbleOutlineIcon className="w-7 h-7" />
                {totalUnread > 0 && (
                    <span className="absolute -top-1 -right-1 w-6 h-6 bg-red-500 text-white text-xs font-bold rounded-full flex items-center justify-center">
                        {totalUnread > 9 ? '9+' : totalUnread}
                    </span>
                )}
            </button>


            {/* Chat List Panel */}
            {isOpen && (
                <div
                    className="fixed bottom-24 right-6 w-80 bg-white rounded-2xl shadow-2xl z-40 overflow-hidden border border-gray-200"
                    style={{ animation: 'adminFadeIn 0.3s ease-out' }}
                >
                    <div className="bg-black text-white p-4 flex items-center justify-between">
                        <h3 className="font-semibold">Student Messages</h3>
                        <button
                            onClick={() => setIsOpen(false)}
                            className="p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <CloseIcon className="w-4 h-4" />
                        </button>
                    </div>

                    <div className="max-h-96 overflow-y-auto">
                        {loading ? (
                            <div className="flex justify-center items-center h-32">
                                <ClipLoader size={30} color="#000" />
                            </div>
                        ) : conversations.length === 0 ? (
                            <div className="text-center py-10">
                                <ChatBubbleOutlineIcon className="w-10 h-10 text-gray-300 mx-auto mb-2" />
                                <p className="text-gray-500 text-sm">No messages yet</p>
                            </div>
                        ) : (
                            conversations.map(conv => (
                                <div
                                    key={conv._id}
                                    onClick={() => setSelectedConversation(conv)}
                                    className="p-4 border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition-colors flex items-center gap-3"
                                >
                                    {conv.otherUser?.photoUrl ? (
                                        <img
                                            src={conv.otherUser.photoUrl}
                                            alt=""
                                            className="w-12 h-12 rounded-full object-cover"
                                            onError={(e) => { e.target.style.display = 'none'; e.target.nextSibling.style.display = 'flex'; }}
                                        />
                                    ) : null}
                                    <div
                                        className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-700 to-black flex items-center justify-center text-white font-bold text-lg"
                                        style={{ display: conv.otherUser?.photoUrl ? 'none' : 'flex' }}
                                    >
                                        {conv.otherUser?.name?.charAt(0)?.toUpperCase() || 'U'}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="flex items-center justify-between">
                                            <h4 className="font-semibold text-sm truncate">{conv.otherUser?.name}</h4>
                                            <span className="text-xs text-gray-400">{formatTime(conv.lastMessageAt)}</span>
                                        </div>
                                        <p className="text-xs text-gray-500 truncate">{conv.course?.title}</p>
                                        <p className="text-sm text-gray-600 truncate">{conv.lastMessage}</p>
                                    </div>
                                    {conv.unreadCount > 0 && (
                                        <span className="w-5 h-5 bg-black text-white text-xs font-bold rounded-full flex items-center justify-center">
                                            {conv.unreadCount}
                                        </span>
                                    )}
                                </div>
                            ))
                        )}
                    </div>
                </div >
            )}

            <style>{`
                @keyframes adminFadeIn {
                    from { opacity: 0; transform: translateY(10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </>
    );
};

// Educator Chat Messages Component (inline)
const EducatorChatMessages = ({ conversation, token, userData }) => {
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [sending, setSending] = useState(false);
    const messagesEndRef = React.useRef(null);

    useEffect(() => {
        fetchMessages();
        const interval = setInterval(fetchMessages, 3000);
        return () => clearInterval(interval);
    }, [conversation._id]);

    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    const fetchMessages = async () => {
        try {
            const { data } = await axios.get(
                `${serverUrl}/api/chat/messages/${conversation._id}`,
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(data.messages);
        } catch (error) {
            console.error('Fetch messages error:', error);
        }
    };

    const sendMessage = async (e) => {
        e.preventDefault();
        if (!newMessage.trim() || sending) return;

        setSending(true);
        try {
            const { data } = await axios.post(
                `${serverUrl}/api/chat/message`,
                { conversationId: conversation._id, message: newMessage.trim() },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            setMessages(prev => [...prev, data.message]);
            setNewMessage('');
        } catch (error) {
            console.error('Send message error:', error);
        } finally {
            setSending(false);
        }
    };

    const formatTime = (date) => {
        return new Date(date).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <>
            <div className="flex-1 overflow-y-auto p-4 space-y-3 bg-gray-50">
                {messages.map(msg => {
                    const isMe = msg.sender._id === userData._id;
                    return (
                        <div key={msg._id} className={`flex ${isMe ? 'justify-end' : 'justify-start'}`}>
                            <div className={`max-w-[75%] ${isMe
                                ? 'bg-black text-white rounded-2xl rounded-br-md'
                                : 'bg-white text-gray-800 rounded-2xl rounded-bl-md border border-gray-200'
                                } px-4 py-2.5 shadow-sm`}>
                                <p className="text-sm">{msg.message}</p>
                                <p className="text-[10px] mt-1 text-gray-400">{formatTime(msg.createdAt)}</p>
                            </div>
                        </div>
                    );
                })}
                <div ref={messagesEndRef} />
            </div>

            <form onSubmit={sendMessage} className="p-3 bg-white border-t border-gray-100">
                <div className="flex items-center gap-2">
                    <input
                        type="text"
                        value={newMessage}
                        onChange={(e) => setNewMessage(e.target.value)}
                        placeholder="Type your reply..."
                        className="flex-1 px-4 py-3 bg-gray-100 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-black/20"
                        disabled={sending}
                    />
                    <button
                        type="submit"
                        disabled={!newMessage.trim() || sending}
                        className="w-11 h-11 bg-black text-white rounded-full flex items-center justify-center hover:bg-gray-800 disabled:opacity-50"
                    >
                        {sending ? <ClipLoader size={16} color="white" /> : '→'}
                    </button>
                </div>
            </form>
        </>
    );
};

export default ChatList;
