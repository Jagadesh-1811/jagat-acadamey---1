// Audio Analyzer utility for real-time voice pitch and volume analysis
// Uses Web Audio API to analyze microphone input

class AudioAnalyzer {
    constructor() {
        this.audioContext = null;
        this.analyser = null;
        this.microphone = null;
        this.dataArray = null;
        this.frequencyArray = null;
        this.isInitialized = false;
        this.stream = null;
    }

    async initialize() {
        if (this.isInitialized) return true;

        try {
            // Request microphone permission
            this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });

            // Create audio context
            this.audioContext = new (window.AudioContext || window.webkitAudioContext)();

            // Create analyser node
            this.analyser = this.audioContext.createAnalyser();
            this.analyser.fftSize = 256;
            this.analyser.smoothingTimeConstant = 0.8;

            // Connect microphone to analyser
            this.microphone = this.audioContext.createMediaStreamSource(this.stream);
            this.microphone.connect(this.analyser);

            // Create data arrays
            const bufferLength = this.analyser.frequencyBinCount;
            this.dataArray = new Uint8Array(bufferLength);
            this.frequencyArray = new Uint8Array(bufferLength);

            this.isInitialized = true;
            return true;
        } catch (error) {
            console.error('Failed to initialize audio analyzer:', error);
            return false;
        }
    }

    // Get current volume level (0-1)
    getVolume() {
        if (!this.isInitialized || !this.analyser) return 0;

        this.analyser.getByteTimeDomainData(this.dataArray);

        let sum = 0;
        for (let i = 0; i < this.dataArray.length; i++) {
            const value = (this.dataArray[i] - 128) / 128;
            sum += value * value;
        }

        const rms = Math.sqrt(sum / this.dataArray.length);
        return Math.min(1, rms * 3); // Amplify and cap at 1
    }

    // Get pitch intensity (0-1) based on frequency analysis
    // Higher values = higher pitch
    getPitchIntensity() {
        if (!this.isInitialized || !this.analyser) return 0.5;

        this.analyser.getByteFrequencyData(this.frequencyArray);

        // Calculate weighted average frequency
        let lowSum = 0;
        let highSum = 0;
        let totalSum = 0;

        const midPoint = Math.floor(this.frequencyArray.length / 2);

        for (let i = 0; i < this.frequencyArray.length; i++) {
            const value = this.frequencyArray[i];
            totalSum += value;

            if (i < midPoint) {
                lowSum += value;
            } else {
                highSum += value;
            }
        }

        if (totalSum === 0) return 0.5;

        // Return ratio of high to low frequencies (0-1)
        // 0 = mostly low pitch, 1 = mostly high pitch
        const ratio = highSum / (lowSum + highSum + 0.001);
        return ratio;
    }

    // Get combined audio data for animation
    getAudioData() {
        return {
            volume: this.getVolume(),
            pitchIntensity: this.getPitchIntensity(),
            isActive: this.isInitialized && this.getVolume() > 0.05
        };
    }

    // Pause the analyzer (stop processing but keep stream)
    pause() {
        if (this.audioContext && this.audioContext.state === 'running') {
            this.audioContext.suspend();
        }
    }

    // Resume the analyzer
    resume() {
        if (this.audioContext && this.audioContext.state === 'suspended') {
            this.audioContext.resume();
        }
    }

    // Clean up resources
    destroy() {
        if (this.microphone) {
            this.microphone.disconnect();
        }
        if (this.audioContext) {
            this.audioContext.close();
        }
        if (this.stream) {
            this.stream.getTracks().forEach(track => track.stop());
        }
        this.isInitialized = false;
    }
}

// Create singleton instance
const audioAnalyzer = new AudioAnalyzer();

export default audioAnalyzer;
