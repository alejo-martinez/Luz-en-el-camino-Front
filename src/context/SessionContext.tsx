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
    login: (user:UserLogin)=> void | Promise<{response:{data:{status:string, error: string}}}>;
    register: (user:UserRegistered)=> void | Promise<{response:{data:{status:string, error: string}}}>;
    logout: ()=> Promise<{status:string, }>;
    loading: boolean;
}

interface UserLogin {
    email: string,
    password: string
}

interface UserRegistered {
    name:string,
    email:string,
    password:string
}

const SessionContext = createContext<SessionContext | undefined>(undefined);

export const SessionProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {

    const [usuario, setUsuario] = useState<User | undefined>(undefined);
    const [isLogged, setIsLogged] = useState(false);
    const [loading, setLoading] = useState(true);

    const current = async()=>{
        try {
            const result = await api.get('/api/session/current');
            const data = result.data;
            if(data.status === 'succes') setUsuario(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const login = async(user:UserLogin)=>{
        try {
            const result = await api.post('/api/session/login', user);
            const data = result.data;
            console.log(data.payload)
            setUsuario(data.payload);
            localStorage.setItem('usuario', JSON.stringify(data.payload));
            return data;
        } catch (error:unknown) {
            console.log(`Error aqui: ${error}`);
            return {
                response: {
                    data: {
                        status: "error",   // Status de error si algo falla
                        error: "Login failed", // Aquí va el mensaje de error
                    },
                },
            };
        }
    }

    const register = async(user:UserRegistered)=>{
        try {
            const result = await api.post('/api/session/register', user);
            const data = result.data;
            console.log(result.data)
            return data;
        } catch (error:unknown) {
            console.log(error);
            return {
                response: {
                    data: {
                        status: "error",   // Status de error si algo falla
                        error: "Error al registrarse", // Aquí va el mensaje de error
                    },
                },
            };
        }
    }

    const logout = async()=>{
        try {
            const result = await api.delete('/api/session/login');
            const data = result.data;
            if(data.status === 'succes'){
                setUsuario(undefined);
                localStorage.removeItem('usuario');
                return data;
            }
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{
        const storedUser = localStorage.getItem('usuario');
        if (storedUser) {
            setUsuario(JSON.parse(storedUser));
            setLoading(false);
        } else {
            current();
            setLoading(false);
        }
    }, [])

    return (
        <SessionContext.Provider value={{usuario, login, isLogged, register, logout, loading}}>
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