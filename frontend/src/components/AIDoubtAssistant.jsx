import React, { useState, useEffect, useRef } from 'react';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import {
    FaRobot,
    FaStop,
    FaTimes,
    FaImage,
    FaMicrophone,
    FaPaperPlane
} from 'react-icons/fa';
import { ClipLoader } from 'react-spinners';
import ParticleSystem from './ParticleSystem';
import audioAnalyzer from './AudioAnalyzer';

const AIDoubtAssistant = ({ courseName, onClose }) => {
    const { token } = useSelector(state => state.user);
    const [messages, setMessages] = useState([]);
    const [input, setInput] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [selectedImage, setSelectedImage] = useState(null);
    const [imagePreview, setImagePreview] = useState(null);
    const messagesEndRef = useRef(null);
    const fileInputRef = useRef(null);
    const recognitionRef = useRef(null);

    // New state for enhanced experience
    const [mode, setMode] = useState('intro'); // 'intro', 'ready', 'speaking', 'listening'
    const [showChat, setShowChat] = useState(false);
    const [currentCaption, setCurrentCaption] = useState('');
    const [displayedCaption, setDisplayedCaption] = useState('');
    const [audioLevel, setAudioLevel] = useState(0);
    const [pitchIntensity, setPitchIntensity] = useState(0.5);
    const audioAnalysisRef = useRef(null);

    // Welcome message for intro
    const welcomeText = `Hello! I am Jagat AI, your personal doubt solver. I'm here to help you master "${courseName}". Ask me anything - type, speak, or share an image of your doubt!`;
    const shortWelcome = "Hello! I am Jagat AI, your personal doubt solver. How can I help you today?";

    // Clean special characters from AI response
    const cleanResponse = (text) => {
        if (!text) return '';
        return text
            // Remove markdown bold/italic
            .replace(/\*\*\*/g, '')
            .replace(/\*\*/g, '')
            .replace(/\*/g, '')
            .replace(/___/g, '')
            .replace(/__/g, '')
            .replace(/_/g, ' ')
            // Remove markdown headers
            .replace(/#{1,6}\s?/g, '')
            // Remove markdown links [text](url)
            .replace(/\[([^\]]+)\]\([^)]+\)/g, '$1')
            // Remove code blocks
            .replace(/```[\s\S]*?```/g, '')
            .replace(/`([^`]+)`/g, '$1')
            // Remove HTML tags
            .replace(/<[^>]*>/g, '')
            // Remove bullet points and list markers
            .replace(/^[-•*]\s?/gm, '')
            .replace(/^\d+\.\s?/gm, '')
            // Remove extra whitespace
            .replace(/\n{3,}/g, '\n\n')
            .trim();
    };

    // Typewriter effect for captions
    useEffect(() => {
        if (!currentCaption) {
            setDisplayedCaption('');
            return;
        }

        let index = 0;
        setDisplayedCaption('');

        const typeInterval = setInterval(() => {
            if (index < currentCaption.length) {
                setDisplayedCaption(prev => prev + currentCaption[index]);
                index++;
            } else {
                clearInterval(typeInterval);
            }
        }, 30); // Speed of typing

        return () => clearInterval(typeInterval);
    }, [currentCaption]);

    // Audio analysis loop for voice reactivity
    useEffect(() => {
        let animationFrame;

        const analyzeAudio = () => {
            if (isListening && audioAnalyzer.isInitialized) {
                const data = audioAnalyzer.getAudioData();
                setAudioLevel(data.volume);
                setPitchIntensity(data.pitchIntensity);
            }
            animationFrame = requestAnimationFrame(analyzeAudio);
        };

        if (isListening) {
            analyzeAudio();
        }

        return () => {
            if (animationFrame) {
                cancelAnimationFrame(animationFrame);
            }
        };
    }, [isListening]);

    // Initialize with welcome animation
    useEffect(() => {
        // Start intro sequence
        setMode('intro');
        setCurrentCaption(welcomeText);

        // Speak welcome after a short delay
        const speakTimeout = setTimeout(() => {
            speakText(shortWelcome, () => {
                // After intro speech ends, transition to ready state
                setTimeout(() => {
                    setMode('ready');
                    setShowChat(true);
                    setCurrentCaption('');

                    // Add welcome message to chat
                    const welcomeMessage = {
                        role: 'assistant',
                        content: welcomeText,
                        timestamp: new Date()
                    };
                    setMessages([welcomeMessage]);
                }, 500);
            });
        }, 800);

        return () => clearTimeout(speakTimeout);
    }, [courseName]);

    // Auto scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
    }, [messages]);

    // Initialize speech recognition
    useEffect(() => {
        if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
            const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
            recognitionRef.current = new SpeechRecognition();
            recognitionRef.current.continuous = false;
            recognitionRef.current.interimResults = false;
            recognitionRef.current.lang = 'en-US';

            recognitionRef.current.onresult = (event) => {
                const transcript = event.results[0][0].transcript;
                setIsListening(false);
                setMode('ready');
                audioAnalyzer.pause();

                // Auto-send the voice message
                if (transcript.trim()) {
                    sendVoiceMessage(transcript.trim());
                }
            };

            recognitionRef.current.onerror = (event) => {
                console.error('Speech recognition error:', event.error);
                setIsListening(false);
                setMode('ready');
                audioAnalyzer.pause();
            };

            recognitionRef.current.onend = () => {
                setIsListening(false);
                setMode('ready');
                audioAnalyzer.pause();
            };
        }

        return () => {
            if (recognitionRef.current) {
                recognitionRef.current.abort();
            }
            audioAnalyzer.destroy();
        };
    }, []);

    // Text-to-Speech function
    const speakText = (text, onComplete) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();

            const utterance = new SpeechSynthesisUtterance(text);
            utterance.rate = 0.9;
            utterance.pitch = 1;
            utterance.volume = 1;

            const voices = window.speechSynthesis.getVoices();
            const preferredVoice = voices.find(v => v.lang.startsWith('en') && v.name.includes('Female'))
                || voices.find(v => v.lang.startsWith('en'))
                || voices[0];
            if (preferredVoice) {
                utterance.voice = preferredVoice;
            }

            utterance.onstart = () => {
                setIsSpeaking(true);
                setMode('speaking');
            };

            utterance.onend = () => {
                setIsSpeaking(false);
                if (onComplete) onComplete();
            };

            utterance.onerror = () => {
                setIsSpeaking(false);
                if (onComplete) onComplete();
            };

            window.speechSynthesis.speak(utterance);
        } else if (onComplete) {
            onComplete();
        }
    };

    // Stop speaking
    const stopSpeaking = () => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            setIsSpeaking(false);
            setMode('ready');
            setCurrentCaption('');
        }
    };

    // Toggle voice input
    const toggleVoiceInput = async () => {
        if (!recognitionRef.current) {
            alert('Speech recognition is not supported in your browser.');
            return;
        }

        if (isListening) {
            recognitionRef.current.stop();
            setIsListening(false);
            setMode('ready');
            audioAnalyzer.pause();
        } else {
            // Initialize audio analyzer
            const initialized = await audioAnalyzer.initialize();
            if (!initialized) {
                console.warn('Audio analyzer could not be initialized');
            }

            recognitionRef.current.start();
            setIsListening(true);
            setMode('listening');
        }
    };

    // Handle image selection
    const handleImageSelect = (e) => {
        const file = e.target.files[0];
        if (file) {
            if (file.size > 5 * 1024 * 1024) {
                alert('Image size should be less than 5MB');
                return;
            }
            setSelectedImage(file);
            setImagePreview(URL.createObjectURL(file));
        }
    };

    // Remove selected image
    const removeImage = () => {
        setSelectedImage(null);
        setImagePreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    // Send voice message (auto-triggered after voice recognition)
    const sendVoiceMessage = async (voiceText) => {
        if (!voiceText || isLoading) return;

        const userMessage = {
            role: 'user',
            content: voiceText,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setIsLoading(true);

        try {
            const { data } = await axios.post(
                `${serverUrl}/api/ai-chat/chat`,
                { message: voiceText },
                { headers: { Authorization: `Bearer ${token}` } }
            );
            const response = data.response;
            const cleanedResponse = cleanResponse(response);

            const assistantMessage = {
                role: 'assistant',
                content: cleanedResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Set caption and speak response
            setCurrentCaption(cleanedResponse);
            speakText(cleanedResponse, () => {
                setCurrentCaption('');
                setMode('ready');
            });

        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
            speakText('Sorry, I encountered an error. Please try again.');
        } finally {
            setIsLoading(false);
        }
    };

    // Send message to AI
    const sendMessage = async () => {
        if ((!input.trim() && !selectedImage) || isLoading) return;

        const userMessage = {
            role: 'user',
            content: input.trim() || 'Please analyze this image',
            image: imagePreview,
            timestamp: new Date()
        };

        setMessages(prev => [...prev, userMessage]);
        setInput('');
        setIsLoading(true);

        try {
            let response;

            if (selectedImage) {
                const formData = new FormData();
                formData.append('message', input.trim() || 'Please analyze this image and help me understand');
                formData.append('image', selectedImage);

                const { data } = await axios.post(
                    `${serverUrl}/api/ai-chat/chat`,
                    formData,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                            'Content-Type': 'multipart/form-data'
                        }
                    }
                );
                response = data.response;
            } else {
                const { data } = await axios.post(
                    `${serverUrl}/api/ai-chat/chat`,
                    { message: input.trim() },
                    { headers: { Authorization: `Bearer ${token}` } }
                );
                response = data.response;
            }

            const cleanedResponse = cleanResponse(response);

            const assistantMessage = {
                role: 'assistant',
                content: cleanedResponse,
                timestamp: new Date()
            };

            setMessages(prev => [...prev, assistantMessage]);

            // Set caption and speak response
            setCurrentCaption(cleanedResponse);
            speakText(cleanedResponse, () => {
                setCurrentCaption('');
                setMode('ready');
            });

        } catch (error) {
            console.error('AI Error:', error);
            const errorMessage = {
                role: 'assistant',
                content: 'Sorry, I encountered an error. Please try again.',
                timestamp: new Date()
            };
            setMessages(prev => [...prev, errorMessage]);
        } finally {
            setIsLoading(false);
            removeImage();
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter' && !e.shiftKey) {
            e.preventDefault();
            sendMessage();
        }
    };

    return (
        <div
            className="fixed bottom-4 right-4 w-[420px] bg-gradient-to-b from-gray-900 to-black rounded-2xl shadow-2xl flex flex-col z-50 border border-gray-700 overflow-hidden"
            style={{
                animation: 'slideUp 0.4s ease-out',
                height: showChat ? '650px' : '400px',
                transition: 'height 0.4s ease-out'
            }}
        >
            {/* Header */}
            <div className="bg-black text-white p-4 flex items-center justify-between border-b border-gray-800">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-full flex items-center justify-center">
                        <FaRobot className="w-5 h-5" />
                    </div>
                    <div>
                        <h3 className="font-bold text-sm">Jagat AI Assistant</h3>
                        <p className="text-xs text-gray-400">
                            {mode === 'intro' && 'Initializing...'}
                            {mode === 'speaking' && 'Speaking'}
                            {mode === 'listening' && 'Listening'}
                            {mode === 'ready' && 'Ready to help'}
                        </p>
                    </div>
                </div>
                <div className="flex items-center gap-2">
                    {isSpeaking && (
                        <button
                            onClick={stopSpeaking}
                            className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                            title="Stop speaking"
                        >
                            <FaStop className="w-4 h-4" />
                        </button>
                    )}
                    <button
                        onClick={() => {
                            stopSpeaking();
                            onClose();
                        }}
                        className="p-2 hover:bg-gray-800 rounded-full transition-colors"
                    >
                        <FaTimes className="w-5 h-5" />
                    </button>
                </div>
            </div>

            {/* 3D Particle System - Show during intro and speaking */}
            {(mode === 'intro' || mode === 'speaking') && (
                <div className="bg-black py-6 relative">
                    <ParticleSystem
                        isActive={true}
                        isSpeaking={isSpeaking}
                        isListening={isListening}
                        audioLevel={audioLevel}
                        pitchIntensity={pitchIntensity}
                        showIntro={mode === 'intro'}
                        mode={mode}
                    />

                    {/* Caption Overlay */}
                    {displayedCaption && (
                        <div className="absolute bottom-2 left-0 right-0 px-4">
                            <div className="bg-black/80 backdrop-blur-sm rounded-lg px-4 py-2 mx-auto max-w-[90%]">
                                <p className="text-white text-xs text-center leading-relaxed line-clamp-3">
                                    {displayedCaption}
                                    <span className="animate-pulse">|</span>
                                </p>
                            </div>
                        </div>
                    )}
                </div>
            )}

            {/* Messages - Show in all modes after intro */}
            {showChat && mode !== 'intro' && (
                <>
                    <div className="flex-1 overflow-y-auto p-4 space-y-4 bg-gray-900">
                        {/* Listening indicator at top of chat */}
                        {mode === 'listening' && (
                            <div className="text-center mb-2">
                                <div className="inline-flex items-center gap-2 bg-white/10 px-4 py-2 rounded-full">
                                    <span className="w-2 h-2 bg-white rounded-full animate-pulse"></span>
                                    <span className="text-white text-xs">Listening...</span>
                                </div>
                            </div>
                        )}

                        {/* Speaking indicator */}
                        {mode === 'speaking' && displayedCaption && (
                            <div className="flex justify-start mb-2">
                                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3 max-w-[85%]">
                                    <p className="text-sm text-white whitespace-pre-wrap">
                                        {displayedCaption}
                                        <span className="animate-pulse">|</span>
                                    </p>
                                </div>
                            </div>
                        )}

                        {messages.map((msg, index) => (
                            <div
                                key={index}
                                className={`flex ${msg.role === 'user' ? 'justify-end' : 'justify-start'}`}
                            >
                                <div
                                    className={`max-w-[85%] rounded-2xl px-4 py-3 ${msg.role === 'user'
                                        ? 'bg-white text-black rounded-br-md'
                                        : 'bg-gray-800 text-white rounded-bl-md border border-gray-700'
                                        }`}
                                >
                                    {msg.image && (
                                        <img
                                            src={msg.image}
                                            alt="Uploaded"
                                            className="w-full max-h-40 object-cover rounded-lg mb-2"
                                        />
                                    )}
                                    <p className="text-sm whitespace-pre-wrap">{msg.content}</p>
                                    <p className={`text-[10px] mt-1 ${msg.role === 'user' ? 'text-gray-500' : 'text-gray-500'}`}>
                                        {new Date(msg.timestamp).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                                    </p>
                                </div>
                            </div>
                        ))}

                        {isLoading && (
                            <div className="flex justify-start">
                                <div className="bg-gray-800 border border-gray-700 rounded-2xl rounded-bl-md px-4 py-3">
                                    <div className="flex items-center gap-2">
                                        <ClipLoader size={16} color="#fff" />
                                        <span className="text-sm text-gray-400">Thinking...</span>
                                    </div>
                                </div>
                            </div>
                        )}
                        <div ref={messagesEndRef} />
                    </div>

                    {/* Image Preview */}
                    {imagePreview && (
                        <div className="px-4 py-2 bg-gray-800 border-t border-gray-700">
                            <div className="relative inline-block">
                                <img src={imagePreview} alt="Preview" className="h-16 rounded-lg" />
                                <button
                                    onClick={removeImage}
                                    className="absolute -top-2 -right-2 w-5 h-5 bg-gray-600 text-white rounded-full flex items-center justify-center text-xs"
                                >
                                    ×
                                </button>
                            </div>
                        </div>
                    )}

                    {/* Input Area */}
                    <div className="p-3 bg-black border-t border-gray-800">
                        <div className="flex items-center gap-2">
                            {/* Image Upload */}
                            <input
                                type="file"
                                ref={fileInputRef}
                                onChange={handleImageSelect}
                                accept="image/*"
                                className="hidden"
                            />
                            <button
                                onClick={() => fileInputRef.current?.click()}
                                className="w-10 h-10 bg-gray-800 text-white rounded-full flex items-center justify-center hover:bg-gray-700 transition-colors"
                                title="Upload image"
                            >
                                <FaImage className="w-4 h-4" />
                            </button>

                            {/* Voice Input */}
                            <button
                                onClick={toggleVoiceInput}
                                className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isListening
                                    ? 'bg-white text-black animate-pulse scale-110'
                                    : 'bg-gray-800 text-white hover:bg-gray-700'
                                    }`}
                                title={isListening ? 'Stop listening' : 'Voice input'}
                            >
                                <FaMicrophone className="w-4 h-4" />
                            </button>

                            {/* Text Input */}
                            <input
                                type="text"
                                value={input}
                                onChange={(e) => setInput(e.target.value)}
                                onKeyPress={handleKeyPress}
                                placeholder={isListening ? 'Listening...' : 'Ask your doubt...'}
                                className="flex-1 px-4 py-3 bg-gray-800 text-white rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-gray-600 placeholder-gray-500"
                                disabled={isLoading || isListening}
                            />

                            {/* Send Button */}
                            <button
                                onClick={sendMessage}
                                disabled={(!input.trim() && !selectedImage) || isLoading}
                                className="w-10 h-10 bg-white text-black rounded-full flex items-center justify-center transition-all disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-200"
                            >
                                {isLoading ? (
                                    <ClipLoader size={16} color="black" />
                                ) : (
                                    <FaPaperPlane className="w-4 h-4" />
                                )}
                            </button>
                        </div>
                    </div>
                </>
            )}

            <style>{`
                @keyframes slideUp {
                    from { opacity: 0; transform: translateY(30px) scale(0.95); }
                    to { opacity: 1; transform: translateY(0) scale(1); }
                }
                .line-clamp-3 {
                    display: -webkit-box;
                    -webkit-line-clamp: 3;
                    -webkit-box-orient: vertical;
                    overflow: hidden;
                }
            `}</style>
        </div>
    );
};

export default AIDoubtAssistant;

