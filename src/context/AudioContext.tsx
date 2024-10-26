'use client';

import React, { createContext, useContext, useState } from 'react';

interface AudioContextType {
    audioPath: string;
    title: string;
    isPlaying: boolean;
    duration: number;
    isShow: boolean;
    handleShow:()=> void
    playAudio: (path: string, title: string, duration:number, id:string) => void;
    pauseAudio: () => void;
    stopAudio: () => void;
    updateCurrentTime: (time: number) => void;
    currentTime: number;
    currentAudio: string
}

const AudioContext = createContext<AudioContextType | undefined>(undefined);

export const AudioProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [audioPath, setAudioPath] = useState('');
    const [title, setTitle] = useState('');
    const [duration, setDuration] = useState(0);
    const [isPlaying, setIsPlaying] = useState(false);
    const [isShow, setIsShow] = useState(false);
    const [currentTime, setCurrentTime] = useState(0);
    const [currentAudio, setCurrentAudio] = useState('');
    

    const handleShow = ()=>{
        setIsShow(!isShow);
    }

    const playAudio = (path: string, title: string, duration: number, id:string) => {
        setAudioPath(path);
        setTitle(title);
        setDuration(duration);
        setIsPlaying(true);
        setIsShow(true);
        setCurrentAudio(id);
    };

    const pauseAudio = () => setIsPlaying(false);

    const stopAudio = () => {
        setIsPlaying(false);
        setAudioPath('');
        setTitle('');
        setIsShow(false);
        setCurrentTime(0);
        setCurrentAudio('');
    };

    const updateCurrentTime = (time: number) => {
        setCurrentTime(time);
      };

    return (
        <AudioContext.Provider value={{ audioPath, title, isPlaying, playAudio, pauseAudio, stopAudio, duration, isShow, handleShow, updateCurrentTime, currentTime, currentAudio }}>
            {children}
        </AudioContext.Provider>
    );
};

export const useAudio = () => {
    const context = useContext(AudioContext);
    if (!context) {
        throw new Error('useAudio must be used within an AudioProvider');
    }
    return context;
};
