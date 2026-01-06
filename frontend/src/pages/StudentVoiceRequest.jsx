import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../App';
import { toast } from 'react-toastify';
import {
    FaMicrophone,
    FaCheckCircle,
    FaCalendarAlt,
    FaHourglassHalf,
    FaCircle,
    FaUsers,
    FaBook,
    FaLock,
    FaPhone
} from 'react-icons/fa';
import Nav from '../components/Nav';
import Footer from '../components/Footer';

const StudentVoiceRequest = () => {
    const navigate = useNavigate();
    const { userData, token } = useSelector(state => state.user);
    const { courseData } = useSelector(state => state.course);

    const [educators, setEducators] = useState([]);
    const [loading, setLoading] = useState(true);
    const [isWeekend, setIsWeekend] = useState(false);
    const [weekendMessage, setWeekendMessage] = useState('');
    const [busyEducators, setBusyEducators] = useState([]);
    const [liveRooms, setLiveRooms] = useState([]);
    const [myRequests, setMyRequests] = useState([]);
    const [requestingId, setRequestingId] = useState(null);
    const [joiningRoomId, setJoiningRoomId] = useState(null);
    const [pollingInterval, setPollingInterval] = useState(null);
    const [previousLiveRoomCount, setPreviousLiveRoomCount] = useState(0);

    useEffect(() => {
        checkWeekendStatus();
        fetchEducators();
        fetchMyRequests();
        fetchLiveRooms();

        // Poll for updates every 5 seconds
        const interval = setInterval(() => {
            fetchMyRequests();
            fetchLiveRooms();
        }, 5000);
        setPollingInterval(interval);

        return () => {
            if (interval) clearInterval(interval);
        };
    }, []);

    // Check if accepted request and redirect to room - ONLY if room is still live
    useEffect(() => {
        // Get list of already redirected request IDs from session storage
        const redirectedIds = JSON.parse(sessionStorage.getItem('redirectedRequestIds') || '[]');

        const acceptedRequest = myRequests.find(r =>
            r.status === 'accepted' &&
            r.roomId &&
            !redirectedIds.includes(r._id) // Skip already redirected requests
        );

        // Only redirect if the room is actually live (exists in liveRooms)
        if (acceptedRequest && liveRooms.length > 0) {
            const roomIsLive = liveRooms.some(room => room.roomId === acceptedRequest.roomId);

            if (roomIsLive) {
                // Mark this request as redirected in session storage
                redirectedIds.push(acceptedRequest._id);
                sessionStorage.setItem('redirectedRequestIds', JSON.stringify(redirectedIds));

                toast.success("Your call request was accepted! Joining room...");
                navigate(`/voice-room/${acceptedRequest.roomId}`);
            }
        }
    }, [myRequests, liveRooms, navigate]);

    const checkWeekendStatus = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/voice-room/weekend-status`);
            setIsWeekend(response.data.isWeekend);
            setWeekendMessage(response.data.message);
        } catch (err) {
            console.error("Weekend check error:", err);
        }
    };

    const fetchEducators = async () => {
        try {
            // Get enrolled course IDs (convert to strings for comparison)
            const enrolledCourseIds = (userData?.enrolledCourses || []).map(c =>
                typeof c === 'object' ? c._id?.toString() : c?.toString()
            );

            console.log('Enrolled course IDs:', enrolledCourseIds);
            console.log('Available courses:', courseData?.length);

            // Filter enrolled courses
            const enrolledCourses = courseData?.filter(course => {
                const courseId = course._id?.toString();
                return enrolledCourseIds.includes(courseId);
            }) || [];

            console.log('Enrolled courses found:', enrolledCourses.length);

            // Create a map of educator ID to their courses
            const educatorCoursesMap = {};
            enrolledCourses.forEach(course => {
                const creatorId = (course.creator?._id || course.creator)?.toString();
                if (creatorId) {
                    if (!educatorCoursesMap[creatorId]) {
                        educatorCoursesMap[creatorId] = [];
                    }
                    educatorCoursesMap[creatorId].push({
                        _id: course._id,
                        title: course.title,
                        thumbnail: course.thumbnail
                    });
                }
            });

            const educatorIds = Object.keys(educatorCoursesMap);
            console.log('Educator IDs to fetch:', educatorIds);

            if (educatorIds.length === 0) {
                console.log('No educator IDs found');
                setEducators([]);
                setLoading(false);
                return;
            }

            // Fetch educator details
            const educatorPromises = educatorIds.map(id =>
                axios.get(`${serverUrl}/api/user/profile/${id}`, {
                    headers: { Authorization: `Bearer ${token}` }
                }).catch(err => {
                    console.error(`Failed to fetch educator ${id}:`, err.response?.data || err.message);
                    return null;
                })
            );

            const responses = await Promise.all(educatorPromises);
            const educatorList = responses
                .filter(r => r && r.data && r.data.user)
                .map(r => {
                    const educator = r.data.user;
                    // Add the courses this educator teaches
                    educator.courses = educatorCoursesMap[educator._id] || [];
                    return educator;
                });

            console.log('Educators loaded with courses:', educatorList);
            setEducators(educatorList);
        } catch (err) {
            console.error("Fetch educators error:", err);
            toast.error("Failed to load educators");
        } finally {
            setLoading(false);
        }
    };

    const fetchMyRequests = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/voice-room/my-requests`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setMyRequests(response.data.requests || []);
        } catch (err) {
            console.error("Fetch requests error:", err);
        }
    };

    const fetchLiveRooms = async () => {
        try {
            const response = await axios.get(`${serverUrl}/api/voice-room/live`, {
                headers: { Authorization: `Bearer ${token}` }
            });
            setBusyEducators(response.data.busyEducators || []);
            const rooms = response.data.liveRooms || [];

            // Notify if new rooms appeared
            if (rooms.length > previousLiveRoomCount && previousLiveRoomCount > 0) {
                toast.info(
                    <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <FaCircle style={{ color: '#ef4444', fontSize: '10px' }} />
                        <span>A new room is live! Join now to ask your doubts.</span>
                    </div>,
                    {
                        autoClose: 5000,
                        position: 'top-center'
                    }
                );
            }
            setPreviousLiveRoomCount(rooms.length);
            setLiveRooms(rooms);
        } catch (err) {
            console.error("Fetch live rooms error:", err);
        }
    };

    const handleJoinRoom = async (roomId) => {
        try {
            setJoiningRoomId(roomId);
            const response = await axios.post(
                `${serverUrl}/api/voice-room/join/${roomId}`,
                {},
                { headers: { Authorization: `Bearer ${token}` } }
            );

            if (response.data.success) {
                toast.success("Joining room...");
                navigate(`/voice-room/${roomId}`);
            }
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to join room");
        } finally {
            setJoiningRoomId(null);
        }
    };

    const handleRequestCall = async (educatorId) => {
        console.log('handleRequestCall called with educatorId:', educatorId);

        if (!educatorId) {
            toast.error("Invalid educator. Please refresh and try again.");
            return;
        }

        try {
            setRequestingId(educatorId);
            console.log('Sending request to:', `${serverUrl}/api/voice-room/request`);
            console.log('Request body:', { educatorId });

            const response = await axios.post(
                `${serverUrl}/api/voice-room/request`,
                { educatorId },
                { headers: { Authorization: `Bearer ${token}` } }
            );

            console.log('Response:', response.data);

            if (response.data.success) {
                toast.success("Call request sent! Waiting for educator to accept...");
                fetchMyRequests();
            }
        } catch (err) {
            console.error('Request call error:', err.response?.data || err.message);
            toast.error(err.response?.data?.message || "Failed to send request");
        } finally {
            setRequestingId(null);
        }
    };

    const hasPendingRequest = (educatorId) => {
        return myRequests.some(r => r.educator?._id === educatorId && r.status === 'pending');
    };

    const isEducatorBusy = (educatorId) => {
        return busyEducators.includes(educatorId);
    };

    if (!userData) {
        return (
            <>
                <Nav />
                <div style={styles.container}>
                    <p style={styles.message}>Please login to access voice calls</p>
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
                        <FaMicrophone style={{ marginRight: '10px', verticalAlign: 'middle' }} />
                        Voice Call with Educators
                    </h1>
                    <p style={styles.subtitle}>Connect with your course educators via voice call</p>
                </div>

                {/* Weekend Status Banner */}
                <div style={{
                    ...styles.weekendBanner,
                    backgroundColor: isWeekend ? 'rgba(34, 197, 94, 0.1)' : 'rgba(239, 68, 68, 0.1)',
                    borderColor: isWeekend ? '#22c55e' : '#ef4444',
                }}>
                    <span style={{ fontSize: '24px', display: 'flex', alignItems: 'center' }}>
                        {isWeekend ? <FaCheckCircle /> : <FaCalendarAlt />}
                    </span>
                    <span style={{ color: isWeekend ? '#22c55e' : '#ef4444' }}>
                        {weekendMessage}
                    </span>
                </div>

                {/* Pending Requests */}
                {myRequests.filter(r => r.status === 'pending').length > 0 && (
                    <div style={styles.pendingSection}>
                        <h3 style={styles.sectionTitle}>
                            <FaHourglassHalf style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                            Pending Requests
                        </h3>
                        {myRequests.filter(r => r.status === 'pending').map(request => (
                            <div key={request._id} style={styles.pendingCard}>
                                <div style={styles.pendingInfo}>
                                    <span style={styles.pendingDot}></span>
                                    <span>Waiting for <strong>{request.educator?.name}</strong> to accept...</span>
                                </div>
                            </div>
                        ))}
                    </div>
                )}

                {/* Live Rooms Section */}
                {liveRooms.length > 0 && (
                    <div style={styles.liveRoomsSection}>
                        <h3 style={styles.sectionTitle}>
                            <FaCircle style={{ color: '#ef4444', marginRight: '8px', verticalAlign: 'middle' }} />
                            Live Rooms - Join Now!
                        </h3>
                        <p style={styles.liveRoomsSubtitle}>These rooms are currently active. Click to join and ask your doubts!</p>
                        <div style={styles.liveRoomsList}>
                            {liveRooms.map(room => (
                                <div key={room.roomId} style={styles.liveRoomCard}>
                                    <div style={styles.liveRoomHeader}>
                                        <div style={styles.liveIndicator}>
                                            <span style={styles.liveBlinkDot}></span>
                                            <span>LIVE</span>
                                        </div>
                                        <span style={styles.participantBadge}>
                                            <FaUsers style={{ marginRight: '4px', verticalAlign: 'middle' }} /> {room.participantCount} {room.participantCount === 1 ? 'student' : 'students'}
                                        </span>
                                    </div>
                                    <div style={styles.liveRoomInfo}>
                                        <img
                                            src={room.educatorPhoto || '/default-avatar.png'}
                                            alt={room.educatorName}
                                            style={styles.liveRoomAvatar}
                                        />
                                        <div>
                                            <h4 style={styles.liveRoomTitle}>{room.title || 'Doubt Session'}</h4>
                                            <p style={styles.liveRoomEducator}>With {room.educatorName}</p>
                                        </div>
                                    </div>
                                    <button
                                        style={{ ...styles.joinButton, backgroundColor: '#000000' }} // Enforce black button
                                        onClick={() => handleJoinRoom(room.roomId)}
                                        disabled={joiningRoomId === room.roomId}
                                    >
                                        <FaMicrophone style={{ marginRight: '8px' }} />
                                        {joiningRoomId === room.roomId ? 'Joining...' : 'Join Room'}
                                    </button>
                                </div>
                            ))}
                        </div>
                    </div>
                )}

                <div style={styles.educatorsSection}>
                    <h3 style={styles.sectionTitle}>
                        <FaBook style={{ marginRight: '8px', verticalAlign: 'middle' }} />
                        Your Educators
                    </h3>

                    {loading ? (
                        <div style={styles.loadingContainer}>
                            <div style={styles.spinner}></div>
                            <p>Loading educators...</p>
                        </div>
                    ) : educators.length === 0 ? (
                        <div style={styles.emptyState}>
                            <p>No educators found. Enroll in courses to see educators here.</p>
                        </div>
                    ) : (
                        <div style={styles.educatorGrid}>
                            {educators.map(educator => (
                                <div key={educator._id} style={styles.educatorCard}>
                                    <div style={styles.educatorHeader}>
                                        <img
                                            src={educator.photoUrl || '/default-avatar.png'}
                                            alt={educator.name}
                                            style={styles.avatar}
                                        />
                                        {isEducatorBusy(educator._id) && (
                                            <span style={styles.liveBadge}><FaCircle style={{ fontSize: '8px', marginRight: '4px' }} /> LIVE</span>
                                        )}
                                    </div>
                                    <h4 style={styles.educatorName}>{educator.name}</h4>
                                    <p style={styles.educatorEmail}>{educator.email}</p>

                                    {/* Show courses taught by this educator */}
                                    {educator.courses && educator.courses.length > 0 && (
                                        <div style={styles.coursesContainer}>
                                            <p style={styles.coursesLabel}>
                                                <FaBook style={{ marginRight: '4px', fontSize: '10px' }} />
                                                Courses:
                                            </p>
                                            <div style={styles.coursesList}>
                                                {educator.courses.map(course => (
                                                    <span key={course._id} style={styles.courseTag}>
                                                        {course.title}
                                                    </span>
                                                ))}
                                            </div>
                                        </div>
                                    )}

                                    <button
                                        style={{
                                            ...styles.requestButton,
                                            backgroundColor: '#000000', // Enforce black button
                                            opacity: (!isWeekend || isEducatorBusy(educator._id) || hasPendingRequest(educator._id)) ? 0.5 : 1,
                                            cursor: (!isWeekend || isEducatorBusy(educator._id) || hasPendingRequest(educator._id)) ? 'not-allowed' : 'pointer',
                                        }}
                                        disabled={!isWeekend || isEducatorBusy(educator._id) || hasPendingRequest(educator._id) || requestingId === educator._id}
                                        onClick={() => handleRequestCall(educator._id)}
                                    >
                                        {requestingId === educator._id ? (
                                            'Sending...'
                                        ) : hasPendingRequest(educator._id) ? (
                                            <>
                                                <FaHourglassHalf style={{ marginRight: '5px' }} /> Request Pending
                                            </>
                                        ) : isEducatorBusy(educator._id) ? (
                                            <>
                                                <FaCircle style={{ color: '#ef4444', marginRight: '5px', fontSize: '10px' }} /> In Call
                                            </>
                                        ) : !isWeekend ? (
                                            <>
                                                <FaLock style={{ marginRight: '5px' }} /> Weekend Only
                                            </>
                                        ) : (
                                            <>
                                                <FaPhone style={{ marginRight: '5px' }} /> Request Call
                                            </>
                                        )}
                                    </button>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
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
        maxWidth: '1200px',
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
    weekendBanner: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 24px',
        borderRadius: '12px',
        border: '1px solid',
        marginBottom: '32px',
        fontSize: '16px',
        fontWeight: '500',
    },
    pendingSection: {
        marginBottom: '32px',
    },
    sectionTitle: {
        fontSize: '20px',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '16px',
    },
    pendingCard: {
        backgroundColor: 'rgba(251, 191, 36, 0.1)',
        border: '1px solid #fbbf24',
        borderRadius: '12px',
        padding: '16px 20px',
    },
    pendingInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        color: '#fbbf24',
    },
    pendingDot: {
        width: '10px',
        height: '10px',
        backgroundColor: '#fbbf24',
        borderRadius: '50%',
        animation: 'pulse 2s infinite',
    },
    educatorsSection: {
        marginTop: '24px',
    },
    loadingContainer: {
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        gap: '16px',
        padding: '40px',
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
        padding: '40px',
        color: '#888',
        backgroundColor: '#1a1a2e',
        borderRadius: '12px',
    },
    educatorGrid: {
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
        gap: '20px',
    },
    educatorCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '24px',
        textAlign: 'center',
        border: '1px solid #333',
        transition: 'all 0.3s ease',
    },
    educatorHeader: {
        position: 'relative',
        display: 'inline-block',
        marginBottom: '16px',
    },
    avatar: {
        width: '80px',
        height: '80px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '3px solid #3b82f6',
    },
    liveBadge: {
        position: 'absolute',
        top: '-5px',
        right: '-10px',
        backgroundColor: 'rgba(239, 68, 68, 0.9)',
        color: '#fff',
        fontSize: '10px',
        fontWeight: '600',
        padding: '4px 8px',
        borderRadius: '12px',
    },
    educatorName: {
        fontSize: '18px',
        fontWeight: '600',
        color: '#fff',
        margin: '0 0 4px 0',
    },
    educatorEmail: {
        fontSize: '14px',
        color: '#888',
        margin: '0 0 12px 0',
    },
    coursesContainer: {
        marginBottom: '16px',
        textAlign: 'left',
    },
    coursesLabel: {
        fontSize: '12px',
        color: '#888',
        margin: '0 0 8px 0',
        fontWeight: '500',
    },
    coursesList: {
        display: 'flex',
        flexWrap: 'wrap',
        gap: '6px',
        justifyContent: 'center',
    },
    courseTag: {
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        color: '#3b82f6',
        padding: '4px 10px',
        borderRadius: '12px',
        fontSize: '11px',
        fontWeight: '500',
        border: '1px solid rgba(59, 130, 246, 0.3)',
    },
    requestButton: {
        width: '100%',
        padding: '12px 20px',
        backgroundColor: '#000000', // Changed from #3b82f6 to #000000
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '14px',
        fontWeight: '600',
        transition: 'none', // Removed transition
    },
    message: {
        textAlign: 'center',
        color: '#888',
        fontSize: '16px',
        padding: '100px 0',
    },
    liveRoomsSection: {
        marginBottom: '32px',
        padding: '24px',
        backgroundColor: 'rgba(239, 68, 68, 0.05)',
        borderRadius: '16px',
        border: '1px solid rgba(239, 68, 68, 0.3)',
    },
    liveRoomsSubtitle: {
        color: '#888',
        fontSize: '14px',
        marginBottom: '16px',
    },
    liveRoomsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    liveRoomCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: '12px',
        padding: '20px',
        border: '1px solid rgba(239, 68, 68, 0.4)',
    },
    liveRoomHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '16px',
    },
    liveIndicator: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '700',
    },
    liveBlinkDot: {
        width: '8px',
        height: '8px',
        backgroundColor: '#ef4444',
        borderRadius: '50%',
        animation: 'pulse 1.5s ease-in-out infinite',
    },
    participantBadge: {
        color: '#888',
        fontSize: '13px',
    },
    liveRoomInfo: {
        display: 'flex',
        alignItems: 'center',
        gap: '16px',
        marginBottom: '16px',
    },
    liveRoomAvatar: {
        width: '56px',
        height: '56px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #ef4444',
    },
    liveRoomTitle: {
        fontSize: '16px',
        fontWeight: '600',
        color: '#fff',
        margin: '0 0 4px 0',
    },
    liveRoomEducator: {
        fontSize: '14px',
        color: '#888',
        margin: 0,
    },
    joinButton: {
        width: '100%',
        padding: '14px 24px',
        backgroundColor: '#000000', // Changed from #22c55e to #000000
        color: '#fff',
        border: 'none',
        borderRadius: '10px',
        fontSize: '15px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'none', // Removed transition (was 'all 0.3s ease')
    },
};

export default StudentVoiceRequest;
