'use client'

import { useEffect, useRef, useState } from 'react';
import * as faceapi from 'face-api.js';
import { AlertTriangle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useVideo } from '@/contexts/videoContext';

interface FaceDetectionProps {
    onViolationDetected: () => void;
    examStarted: boolean;
    examCompleted: boolean;
    isFullscreen: boolean;
}

const FaceDetectionComponent: React.FC<FaceDetectionProps> = ({
    onViolationDetected,
    examStarted,
    examCompleted,
    isFullscreen,
}) => {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const { videoRef } = useVideo();
    const [isModelLoaded, setIsModelLoaded] = useState(false);
    const [showViolationAlert, setShowViolationAlert] = useState(false);
    const [violationCount, setViolationCount] = useState(0);
    const consecutiveNoFaceCyclesRef = useRef<number>(0);
    const detectionInterval = useRef<NodeJS.Timeout | null>(null);

    useEffect(() => {
        const startWebcam = async () => {
            try {
                const stream = await navigator.mediaDevices.getUserMedia({ video: true });
                if (videoRef.current) {
                    videoRef.current.srcObject = stream;
                }
            } catch (error) {
                console.error('Webcam access error:', error);
            }
        };

        if (examStarted && !examCompleted) startWebcam();

        return () => {
            if (videoRef.current && videoRef.current.srcObject) {
                const tracks = (videoRef.current.srcObject as MediaStream).getTracks();
                tracks.forEach((track) => track.stop());
            }
        };
    }, [examStarted, examCompleted, videoRef]);

    useEffect(() => {
        const loadModels = async () => {
            const MODEL_URL = 'https://cdn.jsdelivr.net/gh/justadudewhohacks/face-api.js/weights/';
            await Promise.all([
                faceapi.nets.tinyFaceDetector.loadFromUri(MODEL_URL),
                faceapi.nets.faceLandmark68Net.loadFromUri(MODEL_URL),
            ]);
            setIsModelLoaded(true);
        };
        loadModels();

        return () => {
            if (detectionInterval.current) clearInterval(detectionInterval.current);
        };
    }, []);

    useEffect(() => {
        if (!examStarted || examCompleted || !isFullscreen || !isModelLoaded) {
            if (detectionInterval.current) {
                clearInterval(detectionInterval.current);
                detectionInterval.current = null;
            }
            return;
        }

        const detectFaces = async () => {
            if (!videoRef.current || !canvasRef.current) return;
            const video = videoRef.current;
            const canvas = canvasRef.current;
            const displaySize = { width: video.videoWidth, height: video.videoHeight };
            faceapi.matchDimensions(canvas, displaySize);

            const detections = await faceapi.detectAllFaces(video, new faceapi.TinyFaceDetectorOptions())
                .withFaceLandmarks();

            const ctx = canvas.getContext('2d');
            ctx?.clearRect(0, 0, canvas.width, canvas.height);

            // Violation logic only
            if (detections.length === 0 || !detections[0].landmarks) {
                consecutiveNoFaceCyclesRef.current += 1;
            } else {
                consecutiveNoFaceCyclesRef.current = 0;
            }

            if (consecutiveNoFaceCyclesRef.current === 5) {
                setViolationCount((prev) => prev + 1);
                onViolationDetected();
                setShowViolationAlert(true);
                setTimeout(() => setShowViolationAlert(false), 3000);
            }
        };

        detectionInterval.current = setInterval(detectFaces, 1000);

        return () => {
            if (detectionInterval.current) clearInterval(detectionInterval.current);
        };
    }, [examStarted, examCompleted, isFullscreen, isModelLoaded, onViolationDetected, videoRef]);

    if (!examStarted || examCompleted) return null;

    return (
        <>
            <AnimatePresence>
                {showViolationAlert && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.8 }}
                        animate={{ opacity: 1, scale: 1 }}
                        exit={{ opacity: 0, scale: 0.8 }}
                        className="fixed top-20 left-1/2 transform -translate-x-1/2 z-50"
                    >
                        <div className="bg-red-100 p-4 rounded-lg shadow-lg">
                            <div className="flex items-center space-x-3">
                                <AlertTriangle className="h-5 w-5 text-red-600" />
                                <span className="text-red-800 font-medium">Face not detected! Violation recorded.</span>
                            </div>
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            <div className="fixed top-4 right-4 z-40">
                <div className="relative bg-white p-2 rounded-lg shadow-lg border border-gray-200">
                    <video
                        ref={videoRef}
                        autoPlay
                        muted
                        width="200"
                        height="150"
                        className="rounded border"
                        style={{ transform: 'scaleX(-1)' }}
                    />
                    <canvas
                        ref={canvasRef}
                        width="200"
                        height="150"
                        className="absolute top-0 left-0 pointer-events-none rounded"
                        style={{ transform: 'scaleX(-1)' }}
                    />
                </div>
            </div>

            <div className="fixed bottom-4 left-4 z-50">
                <div className="flex items-center gap-2 bg-white shadow-md rounded-md px-4 py-2 border">
                    <AlertTriangle className="h-4 w-4 text-red-600" />
                    <p className="text-sm font-medium text-red-700">
                        Violations: {violationCount}
                    </p>
                </div>
            </div>
        </>
    );
};

export default FaceDetectionComponent;
