import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';
import PhoneIcon from '@mui/icons-material/Phone';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import SyncIcon from '@mui/icons-material/Sync';
import MicIcon from '@mui/icons-material/Mic';
import InboxIcon from '@mui/icons-material/Inbox';
import CheckIcon from '@mui/icons-material/Check';
import CloseIcon from '@mui/icons-material/Close';
import Nav from '../../components/Nav';
import Footer from '../../components/Footer';

const TeacherCallRequests = () => {
    const navigate = useNavigate();
    const { userData, token } = useSelector(state => state.user);

    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);
    const [processingId, setProcessingId] = useState(null);
    const [isWeekend, setIsWeekend] = useState(false);
    const [startingRoom, setStartingRoom] = useState(false);

    useEffect(() => {
        checkWeekendStatus();
        fetchRequests();

        // Poll for new requests every 5 seconds
        const interval = setInterval(fetchRequests, 5000);

        return () => clearInterval(interval);
    }, []);

    const checkWeekendStatus = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/voice-room/weekend-status`);
            setIsWeekend(response.data.isWeekend);
        } catch (err) {
            console.error("Weekend check error:", err);
        }
    };

    const fetchRequests = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/voice-room/requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setRequests(response.data.requests || []);
        } catch (err) {
            console.error("Fetch requests error:", err);
        } finally {
            setLoading(false);
        }
    };

    // Start a voice room directly without waiting for student request
    const handleStartRoom = async () => {
        try {
            setStartingRoom(true);
            const response = await axios.post(
                `${serverUrl}/api/voice-room/start`,
                { title: `Live Session with ${userData?.name || 'Educator'}` },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Start room response:', response.data);

            if (response.data.success && response.data.roomId) {
                toast.success("Voice room started! Joining...");
                navigate(`/voice-room/${response.data.roomId}`);
            } else {
                toast.error("Failed to start room");
            }
        } catch (err) {
            console.error("Start room error:", err);
            toast.error(err.response?.data?.message || "Failed to start room");
        } finally {
            setStartingRoom(false);
        }
    };

    const handleAccept = async (requestId) => {
        try {
            setProcessingId(requestId);
            console.log('Accepting request:', requestId);

            const response = await axios.put(
                `${serverUrl}/api/voice-room/request/${requestId}`,
                { action: 'accept' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Accept response:', response.data);

            if (response.data.success && response.data.roomId) {
                toast.success("Call accepted! Room created. Joining...");
                // Small delay to ensure room is fully created
                setTimeout(() => {
                    navigate(`/voice-room/${response.data.roomId}`);
                }, 500);
            } else {
                toast.error("Room creation failed. Please try again.");
            }
        } catch (err) {
            console.error('Accept error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Failed to accept request");
        } finally {
            setProcessingId(null);
        }
    };

    const handleReject = async (requestId) => {
        try {
            setProcessingId(requestId);
            const response = await axios.put(
                `${serverUrl}/api/voice-room/request/${requestId}`,
                { action: 'reject' },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.info("Call request rejected");
                fetchRequests();
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to reject request");
        } finally {
            setProcessingId(null);
        }
    };

    const formatTime = (dateString) => {
        const date = new Date(dateString);
        return date.toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    if (!userData || userData.role !== 'educator') {
        return (
            <>
                <Nav />
                <div style={styles.container}>
                    <p style={styles.message}>Only educators can access this page</p>
                </div>
                <Footer />
            </>
        );
    }

    return (
        <>
            <Nav />
            <div style={styles.container}>
                <div style={styles.header}>
                    <h1 style={styles.title}>
                        <PhoneIcon style={{ marginRight: '12px', verticalAlign: 'middle' }} />
                        Voice Call Requests
                    </h1>
                    <p style={styles.subtitle}>Students requesting to talk with you</p>
                </div>

                {/* Weekend Status */}
                {!isWeekend && (
                    <div style={styles.weekendNotice}>
                        <span style={{ fontSize: '20px' }}><CalendarTodayIcon /></span>
                        <span>Voice calls are only available on weekends. Current requests will remain pending.</span>
                    </div>
                )}

                {/* Start Voice Room Button */}
                {isWeekend && (
                    <div style={styles.startRoomSection}>
                        <button
                            style={{
                                ...styles.startRoomButton,
                                backgroundColor: '#000000', // Enforce black button
                                boxShadow: 'none' // Remove color shadow
                            }}
                            onClick={handleStartRoom}
                            disabled={startingRoom}
                        >
                            {startingRoom ? (
                                <>
                                    <SyncIcon style={{ marginRight: '8px', animation: 'spin 1s linear infinite' }} /> Starting...
                                </>
                            ) : (
                                <>
                                    <MicIcon style={{ marginRight: '8px' }} /> Start Voice Room Now
                                </>
                            )}
                        </button>
                        <p style={styles.startRoomHint}>
                            Start a live session immediately. Students will be able to join.
                        </p>
                    </div>
                )}                {/* Requests List */}
                <div style={styles.requestsSection}>
                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p>Loading requests...</p>
                        </div>
                    ) : requests.length === 0 ? (
                        <div style={styles.emptyState}>
                            <span style={styles.emptyIcon}>
                                <InboxIcon />
                            </span>
                            <h3 style={styles.emptyTitle}>No Pending Requests</h3>
                            <p style={styles.emptyText}>You'll see student call requests here when they arrive</p>
                        </div>
                    ) : (
                        <div style={styles.requestsList}>
                            {requests.map(request => (
                                <div key={request._id} style={styles.requestCard}>
                                    <div style={styles.requestHeader}>
                                        <div style={styles.studentInfo}>
                                            <img
                                                src={request.student?.photoUrl || '/default-avatar.png'}
                                                alt={request.student?.name}
                                                style={styles.avatar}
                                            />
                                            <div>
                                                <h4 style={styles.studentName}>{request.student?.name}</h4>
                                                <p style={styles.studentEmail}>{request.student?.email}</p>
                                            </div>
                                        </div>
                                        <div style={styles.requestTime}>
                                            <span style={styles.timeLabel}>Requested at</span>
                                            <span style={styles.timeValue}>{formatTime(request.createdAt)}</span>
                                        </div>
                                    </div>

                                    {request.message && (
                                        <p style={styles.requestMessage}>"{request.message}"</p>
                                    )}

                                    <div style={styles.actionButtons}>
                                        <button
                                            style={{
                                                ...styles.acceptButton,
                                                backgroundColor: '#000000', // Enforce black button
                                            }}
                                            onClick={() => handleAccept(request._id)}
                                            disabled={processingId === request._id || !isWeekend}
                                        >
                                            {processingId === request._id ? 'Connecting...' : (
                                                <><CheckIcon style={{ marginRight: '5px' }} /> Accept Call</>
                                            )}
                                        </button>
                                        <button
                                            style={{
                                                ...styles.rejectButton,
                                                borderColor: '#000000', // Black border
                                                color: '#000000', // Black text
                                            }}
                                            onClick={() => handleReject(request._id)}
                                            disabled={processingId === request._id}
                                        >
                                            <CloseIcon style={{ marginRight: '5px' }} /> Reject
                                        </button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                {/* Live Indicator */}
                {requests.length > 0 && (
                    <div style={styles.liveNotice}>
                        <span style={styles.pulsingDot}></span>
                        <span>Auto-refreshing every 5 seconds</span>
                    </div>
                )}
            </div>
            <Footer />
        </>
    );
};

const styles = {
    container: {
        minHeight: '100vh',
        backgroundColor: '#0f0f0f',
        padding: '100px 24px 60px',
        maxWidth: '800px',
        margin: '0 auto',
    },
    header: {
        textAlign: 'center',
        marginBottom: '40px',
    },
    title: {
        fontSize: '32px',
        fontWeight: '700',
        color: '#fff',
        marginBottom: '8px',
    },
    subtitle: {
        fontSize: '16px',
        color: '#888',
    },
    weekendNotice: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        border: '1px solid #fbbf24',
        borderRadius: '12px',
        marginBottom: '32px',
        color: '#fbbf24',
        fontSize: '14px',
    },
    startRoomSection: {
        textAlign: 'center',
        padding: '24px',
        backgroundColor: 'rgba(34, 197, 94, 0.1)',
        border: '2px solid #22c55e',
        borderRadius: '16px',
        marginBottom: '32px',
    },
    startRoomButton: {
        backgroundColor: '#000000', // Changed from #22c55e to #000000
        color: '#fff',
        padding: '16px 32px',
        fontSize: '18px',
        fontWeight: '700',
        border: 'none',
        borderRadius: '12px',
        cursor: 'pointer',
        transition: 'none', // Removed transition
        boxShadow: 'none', // Removed shadow
    },
    startRoomHint: {
        color: '#888',
        fontSize: '14px',
        marginTop: '12px',
        marginBottom: '0',
    },
    requestsSection: {
        marginTop: '24px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '60px',
        color: '#888',
    },
    spinner: {
        width: '40px',
        height: '40px',
        border: '3px solid #333',
        borderTop: '3px solid #3b82f6',
        borderRadius: '50%',
        animation: 'spin 1s linear infinite',
    },
    emptyState: {
        textAlign: 'center',
        padding: '60px 40px',
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        border: '1px solid #333',
    },
    emptyIcon: {
        fontSize: '48px',
        display: 'block',
        marginBottom: '16px',
    },
    emptyTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#fff',
        margin: '0 0 8px 0',
    },
    emptyText: {
        fontSize: '14px',
        color: '#888',
        margin: 0,
    },
    requestsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    requestCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #333',
        transition: 'all 0.3s ease',
    },
    requestHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    studentInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
    },
    avatar: {
        width: '50px',
        height: '50px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #3b82f6',
    },
    studentName: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#fff',
        margin: '0 0 2px 0',
    },
    studentEmail: {
        fontSize: '13px',
        color: '#888',
        margin: 0,
    },
    requestTime: {
        textAlign: 'right',
    },
    timeLabel: {
        display: 'block',
        fontSize: '12px',
        color: '#666',
        marginBottom: '2px',
    },
    timeValue: {
        fontSize: '14px',
        color: '#888',
        fontWeight: '500',
    },
    requestMessage: {
        backgroundColor: 'rgba(59, 130, 246, 0.1)',
        padding: '12px 16px',
        borderRadius: '8px',
        color: '#93c5fd',
        fontSize: '14px',
        fontStyle: 'italic',
        marginBottom: '16px',
    },
    actionButtons: {
        display: 'flex',
        gap: '12px',
    },
    acceptButton: {
        flex: 1,
        padding: '14px 20px',
        backgroundColor: '#000000', // Changed from #22c55e to #000000
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'none', // Removed transition
    },
    rejectButton: {
        padding: '14px 20px',
        backgroundColor: 'transparent',
        color: '#000000', // Changed from #ef4444 to #000000
        border: '1px solid #000000', // Changed from #ef4444 to #000000
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'none', // Removed transition
    },
    liveNotice: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        gap: '8px',
        marginTop: '32px',
        color: '#666',
        fontSize: '13px',
    },
    pulsingDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#22c55e',
        borderRadius: '50%',
        animation: 'pulse 2s infinite',
    },
    message: {
        textAlign: 'center',
        color: '#888',
        fontSize: '16px',
        padding: '100px 0',
    },
};

export default TeacherCallRequests;
