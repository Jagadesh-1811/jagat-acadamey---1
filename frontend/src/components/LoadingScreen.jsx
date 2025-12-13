import React, { useState, useEffect, useRef } from 'react';
import logo from '../assets/logo.jpg';
import introAudio from '../assets/jagat-academy-chill-intro_n2WbTZw1.mp3';

const LoadingScreen = ({ onLoadingComplete }) => {
    const [hasStarted, setHasStarted] = useState(false);
    const [progress, setProgress] = useState(0);
    const [fadeOut, setFadeOut] = useState(false);
    const [audioDuration, setAudioDuration] = useState(21000); // Default 21s, will be updated
    const audioRef = useRef(null);

    const handleStart = () => {
        setHasStarted(true);
        if (audioRef.current) {
            audioRef.current.volume = 0.7;
            audioRef.current.play().catch(err => {
                console.log('Audio play error:', err);
            });
        }
    };

    // Get audio duration when loaded
    const handleAudioLoad = () => {
        if (audioRef.current && audioRef.current.duration) {
            const durationMs = audioRef.current.duration * 1000;
            setAudioDuration(durationMs);
            console.log('Audio duration:', audioRef.current.duration, 'seconds');
        }
    };

    // Progress animation - synced with audio duration
    useEffect(() => {
        if (!hasStarted) return;

        const duration = audioDuration;
        const interval = 100;
        const increment = 100 / (duration / interval);

        const progressInterval = setInterval(() => {
            setProgress(prev => {
                const next = prev + increment;
                if (next >= 100) {
                    clearInterval(progressInterval);
                    setTimeout(() => {
                        setFadeOut(true);
                        if (audioRef.current) {
                            audioRef.current.pause();
                        }
                        setTimeout(() => {
                            onLoadingComplete();
                        }, 500);
                    }, 500);
                    return 100;
                }
                return next;
            });
        }, interval);

        return () => clearInterval(progressInterval);
    }, [hasStarted, audioDuration, onLoadingComplete]);

    // "Click to Start" screen
    if (!hasStarted) {
        return (
            <div style={styles.container} onClick={handleStart}>
                <audio ref={audioRef} src={introAudio} preload="auto" onLoadedMetadata={handleAudioLoad} />

                <div style={styles.logoContainer}>
                    <img src={logo} alt="Jagat Academy" style={styles.logo} />
                    <div style={styles.pulseRing}></div>
                </div>

                <h1 style={styles.brandName}>Jagat Academy</h1>
                <p style={styles.tagline}>Learn. Grow. Succeed.</p>

                <div style={styles.startButton}>
                    <span style={styles.playIcon}>▶</span>
                    <span>Click to Start</span>
                </div>

                <p style={styles.clickHint}>Click anywhere to begin</p>

                <style>
                    {`
                        @keyframes pulse {
                            0%, 100% { transform: scale(1); opacity: 0.5; }
                            50% { transform: scale(1.1); opacity: 0.8; }
                        }
                        @keyframes float {
                            0%, 100% { transform: translateY(0); }
                            50% { transform: translateY(-10px); }
                        }
                        @keyframes bounce {
                            0%, 100% { transform: scale(1); }
                            50% { transform: scale(1.05); }
                        }
                    `}
                </style>
            </div>
        );
    }

    // Loading screen with progress
    return (
        <div
            style={{
                ...styles.container,
                opacity: fadeOut ? 0 : 1,
                transition: 'opacity 0.5s ease-out'
            }}
        >
            <audio ref={audioRef} src={introAudio} preload="auto" onLoadedMetadata={handleAudioLoad} />

            <div style={styles.logoContainer}>
                <img src={logo} alt="Jagat Academy" style={styles.logo} />
                <div style={styles.pulseRing}></div>
            </div>

            <h1 style={styles.brandName}>Jagat Academy</h1>
            <p style={styles.tagline}>Learn. Grow. Succeed.</p>

            <div style={styles.progressContainer}>
                <div style={styles.progressBar}>
                    <div
                        style={{
                            ...styles.progressFill,
                            width: `${progress}%`
                        }}
                    ></div>
                </div>
                <p style={styles.progressText}>{Math.round(progress)}%</p>
            </div>

            <p style={styles.loadingText}>
                {progress < 30 ? 'Initializing...' :
                    progress < 60 ? 'Loading resources...' :
                        progress < 90 ? 'Almost ready...' :
                            'Launching...'}
            </p>

            <style>
                {`
                    @keyframes pulse {
                        0%, 100% { transform: scale(1); opacity: 0.5; }
                        50% { transform: scale(1.1); opacity: 0.8; }
                    }
                    @keyframes float {
                        0%, 100% { transform: translateY(0); }
                        50% { transform: translateY(-10px); }
                    }
                    @keyframes shimmer {
                        0% { background-position: -200% 0; }
                        100% { background-position: 200% 0; }
                    }
                `}
            </style>
        </div>
    );
};

const styles = {
    container: {
        position: 'fixed',
        top: 0,
        left: 0,
        width: '100vw',
        height: '100vh',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#000000',
        zIndex: 9999,
        cursor: 'pointer',
    },
    logoContainer: {
        position: 'relative',
        marginBottom: '30px',
        animation: 'float 3s ease-in-out infinite',
    },
    logo: {
        width: '150px',
        height: '150px',
        borderRadius: '50%',
        objectFit: 'cover',
        boxShadow: '0 0 60px rgba(255, 255, 255, 0.2), 0 0 100px rgba(255, 255, 255, 0.1)',
        border: '4px solid rgba(255, 255, 255, 0.3)',
    },
    pulseRing: {
        position: 'absolute',
        top: '-15px',
        left: '-15px',
        right: '-15px',
        bottom: '-15px',
        borderRadius: '50%',
        border: '3px solid rgba(255, 255, 255, 0.2)',
        animation: 'pulse 2s ease-in-out infinite',
    },
    brandName: {
        fontSize: '36px',
        fontWeight: '700',
        color: '#ffffff',
        margin: '0 0 8px 0',
        letterSpacing: '2px',
        textShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
    },
    tagline: {
        fontSize: '16px',
        color: '#666',
        margin: '0 0 40px 0',
        letterSpacing: '4px',
        textTransform: 'uppercase',
    },
    startButton: {
        display: 'flex',
        alignItems: 'center',
        gap: '12px',
        padding: '16px 40px',
        backgroundColor: '#ffffff',
        color: '#000',
        borderRadius: '50px',
        fontSize: '18px',
        fontWeight: '600',
        animation: 'bounce 2s ease-in-out infinite',
        boxShadow: '0 0 30px rgba(255, 255, 255, 0.3)',
        marginBottom: '20px',
    },
    playIcon: {
        fontSize: '14px',
    },
    clickHint: {
        color: '#444',
        fontSize: '13px',
        margin: 0,
    },
    progressContainer: {
        width: '280px',
        textAlign: 'center',
    },
    progressBar: {
        width: '100%',
        height: '6px',
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        borderRadius: '3px',
        overflow: 'hidden',
        marginBottom: '12px',
    },
    progressFill: {
        height: '100%',
        background: 'linear-gradient(90deg, #fff, #ccc, #fff)',
        backgroundSize: '200% 100%',
        animation: 'shimmer 2s linear infinite',
        borderRadius: '3px',
        transition: 'width 0.1s ease-out',
    },
    progressText: {
        fontSize: '14px',
        color: '#ffffff',
        fontWeight: '600',
        margin: '0 0 20px 0',
    },
    loadingText: {
        fontSize: '14px',
        color: '#666',
        margin: 0,
        letterSpacing: '1px',
    },
};

export default LoadingScreen;
