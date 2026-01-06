import React, { useEffect, useRef, useState } from 'react';
import { ZegoUIKitPrebuilt } from '@zegocloud/zego-uikit-prebuilt';
import { useParams, useNavigate } from 'react-router-dom';
import { FaCircle, FaTimesCircle, FaExclamationTriangle } from 'react-icons/fa';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';

// ZegoCloud credentials - these should match your backend .env
const ZEGO_APP_ID = parseInt(import.meta.env.VITE_ZEGO_APP_ID) || 0;
const ZEGO_SERVER_SECRET = import.meta.env.VITE_ZEGO_SERVER_SECRET || '';

// Log on component load
console.log('=== VoiceRoom Component Loaded ===');
console.log('VITE_ZEGO_APP_ID from env:', import.meta.env.VITE_ZEGO_APP_ID);
console.log('Parsed ZEGO_APP_ID:', ZEGO_APP_ID);
console.log('ZEGO_SERVER_SECRET length:', ZEGO_SERVER_SECRET.length);
console.log('All VITE env vars:', Object.keys(import.meta.env).filter(k => k.startsWith('VITE')));

const VoiceRoom = () => {
    const { roomId } = useParams();
    const navigate = useNavigate();
    const { userData, token } = useSelector(state => state.user);
    const containerRef = useRef(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [callDuration, setCallDuration] = useState(0);
    const zpRef = useRef(null);

    useEffect(() => {
        let durationInterval;

        const initRoom = async () => {
            try {
                console.log('Initializing voice room...');
                console.log('Room ID:', roomId);
                console.log('User:', userData?.name);

                if (!userData || !token) {
                    setError("Please login to join the voice room");
                    setLoading(false);
                    return;
                }

                if (!roomId) {
                    setError("Invalid room ID");
                    setLoading(false);
                    return;
                }

                // Check if ZegoCloud credentials are configured
                if (!ZEGO_APP_ID || !ZEGO_SERVER_SECRET) {
                    console.error('ZegoCloud credentials not found in frontend .env');
                    console.log('VITE_ZEGO_APP_ID:', ZEGO_APP_ID);
                    console.log('VITE_ZEGO_SERVER_SECRET length:', ZEGO_SERVER_SECRET.length);
                    setError("Voice room configuration error. Please contact support.");
                    setLoading(false);
                    return;
                }

                console.log('ZegoCloud App ID:', ZEGO_APP_ID);
                console.log('Generating token...');

                // Generate token using ZegoCloud's built-in method (simpler and more reliable)
                const kitToken = ZegoUIKitPrebuilt.generateKitTokenForTest(
                    ZEGO_APP_ID,
                    ZEGO_SERVER_SECRET,
                    roomId,
                    userData._id,
                    userData.name || 'User'
                );

                console.log('Token generated successfully');
                console.log('Creating ZegoCloud instance...');

                const zp = ZegoUIKitPrebuilt.create(kitToken);
                zpRef.current = zp;

                console.log('Joining room...');

                zp.joinRoom({
                    container: containerRef.current,
                    scenario: {
                        mode: ZegoUIKitPrebuilt.GroupCall,
                    },
                    showPreJoinView: false,
                    showRoomTimer: true,
                    showUserList: true,
                    showLayoutButton: true,
                    showScreenSharingButton: false,
                    turnOnCameraWhenJoining: false,
                    turnOnMicrophoneWhenJoining: true,
                    showMyCameraToggleButton: false,
                    showMyMicrophoneToggleButton: true,
                    showAudioVideoSettingsButton: true,
                    showTextChat: true,
                    showLeavingView: false,
                    maxUsers: 20,
                    onJoinRoom: () => {
                        console.log('Successfully joined room!');
                        toast.success('Joined voice room successfully!');
                    },
                    onLeaveRoom: async () => {
                        try {
                            await axios.put(
                                `${serverUrl}/api/voice-room/${roomId}/end`,
                                {},
                                { headers: { Authorization: `Bearer ${token}` } }
                            );
                            console.log('Room ended successfully');
                        } catch (err) {
                            console.error("Error ending room:", err);
                        }
                        navigate('/voice-request');
                    },
                    onUserJoin: (users) => {
                        if (users.length > 0) {
                            toast.success(`${users[0].userName || 'Someone'} joined the room`);
                        }
                    },
                    onUserLeave: (users) => {
                        if (users.length > 0) {
                            toast.info(`${users[0].userName || 'A participant'} left the room`);
                        }
                    }
                });

                setLoading(false);

                durationInterval = setInterval(() => {
                    setCallDuration(prev => prev + 1);
                }, 1000);

            } catch (err) {
                console.error("Voice room init error:", err);
                setError(err.message || "Failed to join voice room");
                setLoading(false);
            }
        };

        initRoom();

        return () => {
            if (durationInterval) clearInterval(durationInterval);
            if (zpRef.current) {
                zpRef.current.destroy();
            }
        };
    }, [roomId, userData, token, navigate]);

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
    };

    const handleEndCall = async () => {
        try {
            await axios.put(
                `${serverUrl}/api/voice-room/${roomId}/end`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );
            toast.success("Call ended");
            if (zpRef.current) {
                zpRef.current.destroy();
            }
            navigate('/dashboard');
        } catch (err) {
            toast.error("Failed to end call");
        }
    };

    if (loading) {
        return (
            <div style={styles.loadingContainer}>
                <div style={styles.spinner}></div>
                <p style={styles.loadingText}>Connecting to voice room...</p>
            </div>
        );
    }

    if (error) {
        return (
            <div style={styles.errorContainer}>
                <div style={styles.errorIcon}><FaTimesCircle style={{ color: '#ef4444', fontSize: '48px' }} /></div>
                <h2 style={styles.errorTitle}>Unable to Join Voice Room</h2>
                <p style={styles.errorMessage}>{error}</p>

                {error.includes('configuration') && (
                    <div style={styles.configHelp}>
                        <p className="flex items-center gap-2"><FaExclamationTriangle /> <strong>Admin Setup Required:</strong></p>
                        <p>Add to <code>frontend/.env</code>:</p>
                        <pre style={styles.codeBlock}>
                            VITE_ZEGO_APP_ID=your_app_id{'\n'}
                            VITE_ZEGO_SERVER_SECRET=your_secret
                        </pre>
                        <p>Then restart the frontend server.</p>
                    </div>
                )}

                <button style={styles.backButton} onClick={() => navigate('/dashboard')}>
                    Go to Dashboard
                </button>
            </div>
        );
    }

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div style={styles.roomInfo}>
                    <span style={styles.liveIndicator}><FaCircle style={{ marginRight: '6px', fontSize: '10px' }} /> LIVE</span>
                    <span style={styles.duration}>{formatDuration(callDuration)}</span>
                </div>
                <button style={styles.endCallButton} onClick={handleEndCall}>
                    End Call
                </button>
            </div>
            <div ref={containerRef} style={styles.videoContainer}></div>
        </div>
    );
};

const styles = {
    container: {
        width: '100vw',
        height: '100vh',
        backgroundColor: '#0f0f0f',
        display: 'flex',
        flexDirection: 'column',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        padding: '16px 24px',
        backgroundColor: '#1a1a2e',
        borderBottom: '1px solid #333',
    },
    roomInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
    },
    liveIndicator: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        padding: '6px 12px',
        borderRadius: '20px',
        fontWeight: '600',
        fontSize: '14px',
        animation: 'pulse 2s infinite',
    },
    duration: {
        color: '#fff',
        fontSize: '18px',
        fontFamily: 'monospace',
        fontWeight: '600',
    },
    endCallButton: {
        backgroundColor: '#000000', // Changed from #ef4444 to #000000
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'none', // Removed transition
    },
    videoContainer: {
        flex: 1,
        width: '100%',
    },
    loadingContainer: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        gap: '20px',
    },
    spinner: {
        width: '50px',
        height: '50px',
        border: '4px solid #333',
        borderTop: '4px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    loadingText: {
        color: '#888',
        fontSize: '16px',
    },
    errorContainer: {
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: '#0f0f0f',
        gap: '16px',
    },
    errorIcon: {
        fontSize: '48px',
    },
    errorTitle: {
        color: '#fff',
        fontSize: '24px',
        margin: 0,
    },
    errorMessage: {
        color: '#888',
        fontSize: '16px',
        textAlign: 'center',
        maxWidth: '400px',
    },
    backButton: {
        backgroundColor: '#000000', // Changed from #3b82f6 to #000000
        color: '#fff',
        border: 'none',
        padding: '12px 24px',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        marginTop: '16px',
    },
    configHelp: {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        border: '1px solid #fbbf24',
        borderRadius: '12px',
        padding: '16px',
        marginTop: '16px',
        color: '#fbbf24',
        textAlign: 'left',
        maxWidth: '400px',
    },
    codeBlock: {
        backgroundColor: '#1a1a1a',
        padding: '12px',
        borderRadius: '8px',
        fontFamily: 'monospace',
        fontSize: '12px',
        color: '#22c55e',
        overflow: 'auto',
    },
};

// Add keyframes via style tag
const styleSheet = document.createElement("style");
styleSheet.innerText = `
    @keyframes spin {
        0% { transform: rotate(0deg); }
        100% { transform: rotate(360deg); }
    }
    @keyframes pulse {
        0%, 100% { opacity: 1; }
        50% { opacity: 0.5; }
    }
`;
document.head.appendChild(styleSheet);

export default VoiceRoom;
