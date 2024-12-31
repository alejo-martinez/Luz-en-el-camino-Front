'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/app/utils/axiosInstance';

interface ModalContextType {
    open:boolean;
    setOpen:(value:boolean)=> void;
    sendResponse:(text:string) => Promise<{status:string, message:string}>;
    openComent:(bool:boolean, id:string) => void;
}

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const ModalContext = createContext<ModalContextType | undefined>(undefined);

export const ModalProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [open, setOpen] = useState(false);
    const [idComment, setIdComment] = useState('');

    const openComent = (bool:boolean, id:string)=>{
        setOpen(bool);
        setIdComment(id);
    }
        
    const sendResponse = async(text:string)=>{
        const response = await api.put(`${baseUrl}/api/comment/update/${idComment}`, {text:text});
        // console.log(response.data);
        setIdComment('');
        return response.data;
    }

    // useEffect(()=>{
        
    // },[]);

    return (
        <ModalContext.Provider value={{open, setOpen, sendResponse, openComent }}>
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