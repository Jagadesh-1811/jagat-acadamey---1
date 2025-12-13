import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { serverUrl } from '../../App';
import { toast } from 'react-toastify';

const AdminVoiceMonitor = () => {
    const navigate = useNavigate();
    const { token } = useSelector(state => state.user);

    const [activeRooms, setActiveRooms] = useState([]);
    const [loading, setLoading] = useState(true);
    const [endingRoomId, setEndingRoomId] = useState(null);

    useEffect(() => {
        fetchActiveRooms();
        const interval = setInterval(fetchActiveRooms, 5000);
        return () => clearInterval(interval);
    }, []);

    const fetchActiveRooms = async () => {
        try {
            const adminToken = localStorage.getItem('adminToken');
            // Use admin-specific endpoint that uses isAdminAuth middleware
            const response = await axios.get(`${serverUrl}/api/voice-room/admin/active`, {
                headers: { Authorization: `Bearer ${adminToken}` }
            });
            setActiveRooms(response.data.rooms || []);
        } catch (err) {
            console.error("Fetch active rooms error:", err);
        } finally {
            setLoading(false);
        }
    };

    const handleEndRoom = async (roomId) => {
        if (!window.confirm("Are you sure you want to end this voice room?")) return;

        try {
            setEndingRoomId(roomId);
            const adminToken = localStorage.getItem('adminToken');
            // Use admin-specific endpoint
            await axios.put(
                `${serverUrl}/api/voice-room/admin/${roomId}/end`,
                {},
                { headers: { Authorization: `Bearer ${adminToken}` } }
            );
            toast.success("Voice room ended successfully");
            fetchActiveRooms();
        } catch (err) {
            toast.error(err.response?.data?.message || "Failed to end room");
        } finally {
            setEndingRoomId(null);
        }
    };

    const formatDuration = (seconds) => {
        const mins = Math.floor(seconds / 60);
        const secs = seconds % 60;
        return `${mins}m ${secs}s`;
    };

    const formatTime = (dateString) => {
        return new Date(dateString).toLocaleTimeString('en-US', {
            hour: '2-digit',
            minute: '2-digit',
            hour12: true
        });
    };

    return (
        <div style={styles.container}>
            <div style={styles.header}>
                <div>
                    <h1 style={styles.title}>🎙️ Voice Room Monitor</h1>
                    <p style={styles.subtitle}>Monitor and manage all active voice rooms</p>
                </div>
                <button style={styles.refreshButton} onClick={fetchActiveRooms}>
                    🔄 Refresh
                </button>
            </div>

            {/* Stats Cards */}
            <div style={styles.statsRow}>
                <div style={styles.statCard}>
                    <span style={styles.statValue}>{activeRooms.length}</span>
                    <span style={styles.statLabel}>Active Rooms</span>
                </div>
                <div style={styles.statCard}>
                    <span style={styles.statValue}>
                        {activeRooms.reduce((acc, room) => acc + (room.currentDuration || 0), 0)}s
                    </span>
                    <span style={styles.statLabel}>Total Call Time</span>
                </div>
            </div>

            {/* Active Rooms List */}
            <div style={styles.roomsSection}>
                <h3 style={styles.sectionTitle}>
                    <span style={styles.liveDot}></span>
                    Active Voice Rooms
                </h3>

                {loading ? (
                    <div style={styles.loadingContainer}>
                        <div style={styles.spinner}></div>
                        <p>Loading active rooms...</p>
                    </div>
                ) : activeRooms.length === 0 ? (
                    <div style={styles.emptyState}>
                        <span style={styles.emptyIcon}>🔇</span>
                        <h3 style={styles.emptyTitle}>No Active Voice Rooms</h3>
                        <p style={styles.emptyText}>Voice rooms will appear here when students and educators start calls</p>
                    </div>
                ) : (
                    <div style={styles.roomsList}>
                        {activeRooms.map(room => (
                            <div key={room._id} style={styles.roomCard}>
                                <div style={styles.roomHeader}>
                                    <span style={styles.liveTag}>🔴 LIVE</span>
                                    <span style={styles.roomDuration}>
                                        {formatDuration(room.currentDuration)}
                                    </span>
                                </div>

                                <div style={styles.participants}>
                                    <div style={styles.participant}>
                                        <img
                                            src={room.student?.photoUrl || '/default-avatar.png'}
                                            alt={room.student?.name}
                                            style={styles.avatar}
                                        />
                                        <div>
                                            <span style={styles.participantRole}>Student</span>
                                            <span style={styles.participantName}>{room.student?.name}</span>
                                        </div>
                                    </div>

                                    <span style={styles.callIcon}>📞</span>

                                    <div style={styles.participant}>
                                        <img
                                            src={room.educator?.photoUrl || '/default-avatar.png'}
                                            alt={room.educator?.name}
                                            style={styles.avatar}
                                        />
                                        <div>
                                            <span style={styles.participantRole}>Educator</span>
                                            <span style={styles.participantName}>{room.educator?.name}</span>
                                        </div>
                                    </div>
                                </div>

                                <div style={styles.roomFooter}>
                                    <span style={styles.startTime}>
                                        Started at {formatTime(room.startTime)}
                                    </span>
                                    <button
                                        style={styles.endButton}
                                        onClick={() => handleEndRoom(room.roomId)}
                                        disabled={endingRoomId === room.roomId}
                                    >
                                        {endingRoomId === room.roomId ? 'Ending...' : '⏹ End Room'}
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Auto-refresh indicator */}
            <div style={styles.autoRefresh}>
                <span style={styles.pulsingDot}></span>
                Auto-refreshing every 5 seconds
            </div>
        </div>
    );
};

const styles = {
    container: {
        padding: '24px',
        backgroundColor: '#0f0f0f',
        minHeight: '100vh',
    },
    header: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '32px',
    },
    title: {
        fontSize: '28px',
        fontWeight: '700',
        color: '#fff',
        margin: '0 0 4px 0',
    },
    subtitle: {
        fontSize: '14px',
        color: '#888',
        margin: 0,
    },
    refreshButton: {
        padding: '10px 20px',
        backgroundColor: '#1a1a2e',
        color: '#fff',
        border: '1px solid #333',
        borderRadius: '8px',
        fontSize: '14px',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    statsRow: {
        display: 'grid',
        gridTemplateColumns: 'repeat(2, 1fr)',
        gap: '16px',
        marginBottom: '32px',
    },
    statCard: {
        backgroundColor: '#1a1a2e',
        padding: '24px',
        borderRadius: '12px',
        textAlign: 'center',
        border: '1px solid #333',
    },
    statValue: {
        display: 'block',
        fontSize: '32px',
        fontWeight: '700',
        color: '#3b82f6',
        marginBottom: '4px',
    },
    statLabel: {
        fontSize: '14px',
        color: '#888',
    },
    roomsSection: {
        marginTop: '24px',
    },
    sectionTitle: {
        display: 'flex',
        alignItems: 'center',
        gap: '8px',
        fontSize: '18px',
        fontWeight: '600',
        color: '#fff',
        marginBottom: '16px',
    },
    liveDot: {
        width: '10px',
        height: '10px',
        backgroundColor: '#ef4444',
        borderRadius: '50%',
        animation: 'pulse 2s infinite',
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
    roomsList: {
        display: 'flex',
        flexDirection: 'column',
        gap: '16px',
    },
    roomCard: {
        backgroundColor: '#1a1a2e',
        borderRadius: '16px',
        padding: '24px',
        border: '1px solid #333',
    },
    roomHeader: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: '20px',
    },
    liveTag: {
        backgroundColor: 'rgba(239, 68, 68, 0.2)',
        color: '#ef4444',
        padding: '6px 12px',
        borderRadius: '20px',
        fontSize: '12px',
        fontWeight: '600',
    },
    roomDuration: {
        color: '#fff',
        fontSize: '16px',
        fontWeight: '600',
        fontFamily: 'monospace',
    },
    participants: {
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'space-between',
        gap: '20px',
        marginBottom: '20px',
    },
    participant: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        flex: 1,
    },
    avatar: {
        width: '48px',
        height: '48px',
        borderRadius: '50%',
        objectFit: 'cover',
        border: '2px solid #3b82f6',
    },
    participantRole: {
        display: 'block',
        fontSize: '11px',
        color: '#888',
        textTransform: 'uppercase',
        letterSpacing: '0.5px',
    },
    participantName: {
        display: 'block',
        fontSize: '15px',
        fontWeight: '600',
        color: '#fff',
    },
    callIcon: {
        fontSize: '24px',
    },
    roomFooter: {
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingTop: '16px',
        borderTop: '1px solid #333',
    },
    startTime: {
        fontSize: '13px',
        color: '#888',
    },
    endButton: {
        padding: '10px 20px',
        backgroundColor: '#ef4444',
        color: '#fff',
        border: 'none',
        borderRadius: '8px',
        fontSize: '13px',
        fontWeight: '600',
        cursor: 'pointer',
        transition: 'all 0.3s ease',
    },
    autoRefresh: {
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
};

export default AdminVoiceMonitor;
