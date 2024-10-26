'use client';

import React, { createContext, useContext, useEffect, useState } from 'react';
import api from '@/app/utils/axiosInstance';

interface User{
    id: string,
    name: string,
    email: string,
    rol: string
}

interface SessionContext {
    isLogged:boolean;
    usuario: User | undefined;
    login: (user:any)=> void;
    register: (user:any)=> void;
    logout: ()=> void;
}

const SessionContext = createContext<SessionContext | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [usuario, setUsuario] = useState<any>(null);
    const [isLogged, setIsLogged] = useState(false);

    const current = async()=>{
        try {
            const result = await api.get('/api/session/current');
            const data = result.data;
            if(data.status === 'succes') setUsuario(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const login = async(user:any)=>{
        try {
            const result = await api.post('/api/session/login', user);
            const data = result.data;
            setUsuario(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const register = async(user:any)=>{
        try {
            const result = await api.post('/api/session/register', user);
            const data = result.data;
            console.log(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const logout = async()=>{
        try {
            const result = await api.delete('/api/session/login');
            const data = result.data;
            if(data.status === 'succes') setUsuario(null)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
            current();
    }, [])

    return (
        <SessionContext.Provider value={{usuario, login, isLogged, register, logout}}>
            {children}
        </SessionContext.Provider>
    )
}

export const useSession = () => {
    const context = useContext(SessionContext);
    if (!context) {
        throw new Error('useSidebar must be used within an SidebarProvider');
    }
    return context;
}