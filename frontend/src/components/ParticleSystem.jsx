import React, { useRef, useEffect, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';

// Easing function for elastic intro effect (defined outside component)
const easeOutElastic = (x) => {
    const c4 = (2 * Math.PI) / 3;
    return x === 0
        ? 0
        : x === 1
            ? 1
            : Math.pow(2, -10 * x) * Math.sin((x * 10 - 0.75) * c4) + 1;
};

// Particle templates - define shapes
const TEMPLATES = {
    sphere: {
        name: 'Sphere',
        getPosition: (i, total) => {
            // Golden spiral on a sphere (Fibonacci sphere)
            const phi = Math.acos(1 - 2 * (i + 0.5) / total);
            const theta = Math.PI * (1 + Math.sqrt(5)) * (i + 0.5);

            const r = 1.2; // Radius

            return {
                x: r * Math.sin(phi) * Math.cos(theta),
                y: r * Math.sin(phi) * Math.sin(theta),
                z: r * Math.cos(phi)
            };
        }
    }
};

const ParticleSystem = ({
    isActive,
    isSpeaking,
    isListening,
    audioLevel = 0,      // Voice volume (0-1)
    pitchIntensity = 0.5, // Voice pitch (0=low, 1=high)
    showIntro = false    // Show entrance animation
}) => {
    const containerRef = useRef(null);
    const sceneRef = useRef(null);
    const rendererRef = useRef(null);
    const cameraRef = useRef(null);
    const particlesRef = useRef(null);
    const animationRef = useRef(null);
    const introProgressRef = useRef(0);
    const basePositionsRef = useRef(null);

    const template = 'sphere';
    const particleColor = '#ffffff';
    const particleCount = 1500;

    // Store props in refs for animation loop
    const propsRef = useRef({
        volume: 0,
        pitch: 0.5,
        isSpeaking: false,
        isListening: false,
        showIntro: false
    });

    useEffect(() => {
        propsRef.current = {
            volume: audioLevel,
            pitch: pitchIntensity,
            isSpeaking,
            isListening,
            showIntro
        };
    }, [audioLevel, pitchIntensity, isSpeaking, isListening, showIntro]);

    // Create particles function
    const createParticlesImpl = useCallback(() => {
        if (!sceneRef.current) return;

        if (particlesRef.current) {
            sceneRef.current.remove(particlesRef.current);
            particlesRef.current.geometry.dispose();
            particlesRef.current.material.dispose();
        }

        const templateConfig = TEMPLATES[template];
        const geometry = new THREE.BufferGeometry();
        const positions = new Float32Array(particleCount * 3);
        const colors = new Float32Array(particleCount * 3);

        const color = new THREE.Color(particleColor);

        for (let i = 0; i < particleCount; i++) {
            const pos = templateConfig.getPosition(i, particleCount);
            positions[i * 3] = pos.x;
            positions[i * 3 + 1] = pos.y;
            positions[i * 3 + 2] = pos.z;

            // Color variation - cyan/white gradient
            color.getHSL({ h: 0, s: 0, l: 0 });
            const variedColor = new THREE.Color().setHSL(
                0.5 + (Math.random() - 0.5) * 0.1, // Slight cyan tint
                0.1 + Math.random() * 0.1,
                0.8 + Math.random() * 0.2
            );
            colors[i * 3] = variedColor.r;
            colors[i * 3 + 1] = variedColor.g;
            colors[i * 3 + 2] = variedColor.b;
        }

        // Store base positions for reset
        basePositionsRef.current = new Float32Array(positions);

        geometry.setAttribute('position', new THREE.BufferAttribute(positions, 3));
        geometry.setAttribute('color', new THREE.BufferAttribute(colors, 3));

        const material = new THREE.PointsMaterial({
            size: 0.05,
            vertexColors: true,
            transparent: true,
            opacity: 0.7,
            sizeAttenuation: true,
            blending: THREE.AdditiveBlending
        });

        const particles = new THREE.Points(geometry, material);

        // Start small if intro animation
        if (propsRef.current.showIntro) {
            particles.scale.setScalar(0);
            introProgressRef.current = 0;
        }

        sceneRef.current.add(particles);
        particlesRef.current = particles;
    }, []);

    // Initialize Three.js scene
    useEffect(() => {
        if (!containerRef.current) return;

        // Scene setup
        const scene = new THREE.Scene();
        sceneRef.current = scene;

        // Camera
        const camera = new THREE.PerspectiveCamera(75, 1, 0.1, 1000);
        camera.position.z = 5;
        cameraRef.current = camera;

        // Renderer
        const renderer = new THREE.WebGLRenderer({ alpha: true, antialias: true });
        renderer.setSize(220, 220);
        renderer.setClearColor(0x000000, 0);
        containerRef.current.appendChild(renderer.domElement);
        rendererRef.current = renderer;

        // Create particles
        createParticlesImpl();

        // Animation loop
        const animate = () => {
            animationRef.current = requestAnimationFrame(animate);

            if (particlesRef.current) {
                const particles = particlesRef.current;
                const positions = particles.geometry.attributes.position.array;
                const time = Date.now() * 0.001;

                // Get current props from ref
                const { volume, pitch, isSpeaking: speaking, isListening: listening, showIntro: intro } = propsRef.current;

                // Dynamic Rotation - faster when active
                const rotationSpeed = (speaking || listening) ? 0.008 : 0.003;
                particles.rotation.y += rotationSpeed;
                particles.rotation.x += rotationSpeed * 0.3;

                // === INTRO ANIMATION ===
                if (intro && introProgressRef.current < 1) {
                    introProgressRef.current = Math.min(1, introProgressRef.current + 0.02);
                    const progress = easeOutElastic(introProgressRef.current);

                    // Scale up from 0 with elastic bounce
                    particles.scale.setScalar(progress);

                    // Entrance spin
                    particles.rotation.y += (1 - progress) * 0.1;
                }

                // === VOICE REACTIVE ANIMATION ===
                let scaleTarget = 1;

                if (speaking || listening) {
                    let effectiveVolume = volume;
                    let effectivePitch = pitch;

                    // When speaking (AI talking), simulate dynamic audio levels
                    if (speaking && !listening) {
                        // Simulate speech pattern with varying amplitude and pitch
                        const speechRhythm = Math.sin(time * 8) * 0.5 + 0.5; // 0 to 1
                        const pitchVariation = Math.sin(time * 3) * 0.3 + 0.5; // 0.2 to 0.8
                        const wordPauses = Math.sin(time * 1.5) > 0.7 ? 0.2 : 1; // Simulate pauses between words

                        effectiveVolume = 0.4 + speechRhythm * 0.4 * wordPauses;
                        effectivePitch = 0.3 + pitchVariation * 0.4;
                    }

                    // Voice intensity affects base scale
                    const voiceIntensity = effectiveVolume * 0.4;

                    // Pitch affects scale direction
                    // High pitch (> 0.5) = expand (beat up), Low pitch (< 0.5) = contract (beat down)
                    const pitchOffset = (effectivePitch - 0.5) * 0.3;

                    // Beat effect - pulsing with voice
                    const beatFrequency = 4 + effectiveVolume * 8; // Faster beat with louder voice
                    const beat = Math.sin(time * beatFrequency) * voiceIntensity;

                    scaleTarget = 1 + voiceIntensity + pitchOffset + beat;

                    // Apply glow effect based on audio
                    particles.material.opacity = 0.6 + effectiveVolume * 0.4;
                    particles.material.size = 0.05 + effectiveVolume * 0.04;

                    // Move particles slightly based on pitch
                    if (basePositionsRef.current && positions.length === basePositionsRef.current.length) {
                        for (let i = 0; i < positions.length; i += 3) {
                            const baseX = basePositionsRef.current[i];
                            const baseY = basePositionsRef.current[i + 1];
                            const baseZ = basePositionsRef.current[i + 2];

                            // Calculate direction from center
                            const len = Math.sqrt(baseX * baseX + baseY * baseY + baseZ * baseZ);
                            if (len > 0) {
                                const dirX = baseX / len;
                                const dirY = baseY / len;
                                const dirZ = baseZ / len;

                                // Offset based on pitch and volume
                                const offset = (effectivePitch - 0.5) * effectiveVolume * 0.15;
                                const waveOffset = Math.sin(time * 3 + i * 0.01) * effectiveVolume * 0.05;

                                positions[i] = baseX + dirX * (offset + waveOffset);
                                positions[i + 1] = baseY + dirY * (offset + waveOffset);
                                positions[i + 2] = baseZ + dirZ * (offset + waveOffset);
                            }
                        }
                        particles.geometry.attributes.position.needsUpdate = true;
                    }
                } else {
                    // Idle breathing animation
                    const breathing = Math.sin(time * 1.5) * 0.05;
                    const gentlePulse = Math.sin(time * 2.5) * 0.03;
                    scaleTarget = 1 + breathing + gentlePulse;

                    // Reset to base positions slowly
                    if (basePositionsRef.current && positions.length === basePositionsRef.current.length) {
                        for (let i = 0; i < positions.length; i += 3) {
                            positions[i] += (basePositionsRef.current[i] - positions[i]) * 0.05;
                            positions[i + 1] += (basePositionsRef.current[i + 1] - positions[i + 1]) * 0.05;
                            positions[i + 2] += (basePositionsRef.current[i + 2] - positions[i + 2]) * 0.05;
                        }
                        particles.geometry.attributes.position.needsUpdate = true;
                    }

                    particles.material.opacity = 0.7;
                    particles.material.size = 0.05;
                }

                // Apply scale with smooth easing
                particles.scale.x += (scaleTarget - particles.scale.x) * 0.1;
                particles.scale.y += (scaleTarget - particles.scale.y) * 0.1;
                particles.scale.z += (scaleTarget - particles.scale.z) * 0.1;

                // Keep centered
                particles.position.x += (0 - particles.position.x) * 0.03;
                particles.position.y += (0 - particles.position.y) * 0.03;
            }

            renderer.render(scene, camera);
        };

        animate();

        const currentContainer = containerRef.current;

        return () => {
            cancelAnimationFrame(animationRef.current);
            if (currentContainer && renderer.domElement) {
                currentContainer.removeChild(renderer.domElement);
            }
            renderer.dispose();
        };
    }, [createParticlesImpl]);

    // Reset intro when showIntro changes
    useEffect(() => {
        if (showIntro) {
            introProgressRef.current = 0;
            if (particlesRef.current) {
                particlesRef.current.scale.setScalar(0);
            }
        }
    }, [showIntro]);

    if (!isActive) return null;

    return (
        <div className="relative">
            {/* Glow effect behind particles */}
            <div
                className="absolute inset-0 rounded-full blur-xl transition-opacity duration-300"
                style={{
                    background: 'radial-gradient(circle, rgba(255,255,255,0.2) 0%, transparent 70%)',
                    opacity: (isSpeaking || isListening) ? 0.8 : 0.3,
                    transform: 'scale(1.2)'
                }}
            />

            {/* Particle Canvas */}
            <div
                ref={containerRef}
                className="w-[220px] h-[220px] mx-auto relative z-10"
                style={{
                    filter: (isSpeaking || isListening) ? 'brightness(1.4) drop-shadow(0 0 20px rgba(255,255,255,0.4))' : 'brightness(1)',
                    transition: 'filter 0.3s ease'
                }}
            />

            {/* Status Indicator */}
            <div className="text-center mt-3">
                {isSpeaking && (
                    <span className="text-xs text-gray-300 flex items-center justify-center gap-2">
                        <span className="flex gap-1">
                            <span className="w-1 h-3 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-4 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '150ms' }} />
                            <span className="w-1 h-2 bg-green-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                        </span>
                        Speaking...
                    </span>
                )}
                {isListening && (
                    <span className="text-xs text-gray-300 flex items-center justify-center gap-2">
                        <span className="flex gap-1">
                            <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '0ms' }} />
                            <span className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '100ms' }} />
                            <span className="w-1 h-3 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '200ms' }} />
                            <span className="w-1 h-4 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '300ms' }} />
                            <span className="w-1 h-2 bg-red-400 rounded-full animate-pulse" style={{ animationDelay: '400ms' }} />
                        </span>
                        Listening...
                    </span>
                )}
            </div>

            <style>{`
                @keyframes fadeIn {
                    from { opacity: 0; transform: translateY(-10px); }
                    to { opacity: 1; transform: translateY(0); }
                }
            `}</style>
        </div>
    );
};

export default ParticleSystem;
