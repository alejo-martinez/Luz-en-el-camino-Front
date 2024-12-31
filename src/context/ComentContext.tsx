'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/app/utils/axiosInstance';
import socket from '@/app/utils/socketInstance';

interface ComentData{
    author:string | undefined,
    text:string,
    id:string,
    type:string,
    title:string
}

interface ComentContextType{
    sendComent:(data:ComentData)=> void;
    deleteComent:(fid:string, type:string, cid:string) => Promise<{status:string, message:string}>;
}

const ComentContext = createContext<ComentContextType | undefined>(undefined);

export const ComentProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    
    const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;
    
    const sendComent = (data:ComentData)=>{
        socket.emit('comment', data);
    }

    const deleteComent = async(fid:string, type:string, cid:string) =>{
        const response = await api.delete(`${baseUrl}/api/comment/delete/${cid}`, {data:{fid:fid, type:type}});
        return response.data;
    }

    useEffect(()=>{
        socket.on('connection', ()=>{
            console.log('Conectado al servidor');
        })
    },[]);

    return (
        <ComentContext.Provider value={{sendComent, deleteComent}}>
            {children}
        </ComentContext.Provider>
    );
};

export const useComent = () => {
    const context = useContext(ComentContext);
    if (!context) {
        throw new Error('useComent must be used within an ComentProvider');
    }
    return context;
};