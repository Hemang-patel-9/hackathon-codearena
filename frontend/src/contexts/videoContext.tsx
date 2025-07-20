import React, { createContext, useContext, useRef } from 'react';

const VideoContext = createContext<{ videoRef: React.RefObject<HTMLVideoElement> } | null>(null);

export const VideoProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const videoRef = useRef<HTMLVideoElement>(null);
    return <VideoContext.Provider value={{ videoRef }}>{children}</VideoContext.Provider>;
};

export const useVideo = () => {
    const context = useContext(VideoContext);
    if (!context) {
        throw new Error('useVideo must be used within a VideoProvider');
    }
    return context;
};
