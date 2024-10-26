'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/app/utils/axiosInstance';

interface ModalContextType {
    open:boolean;
    setOpen:(value:boolean)=> void;
    sendResponse:(id:string, text:string) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
        
    const sendResponse = async(id:string, text:string)=>{
        const response = await api.put(`${baseUrl}/api/comment/update/${id}`, {text:text});
        console.log(response.data);
    }

    // useEffect(()=>{
        
    // },[]);

    return (
        <ModalContext.Provider value={{open, setOpen, sendResponse }}>
            {children}
        </ModalContext.Provider>
    );
};

export const useModal = () => {
    const context = useContext(ModalContext);
    if (!context) {
        throw new Error('useModal must be used within an ModalProvider');
    }
    return context;
};