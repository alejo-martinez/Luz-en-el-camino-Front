'use client';

import { useSidebar } from "@/context/SidebarContext";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import api from "../utils/axiosInstance";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "@/context/SessionContext";

export default function SignIn() {

    const router = useRouter();

    const { showSidebar } = useSidebar();
    const { login } = useSession();
    const [userLogin, setUserLogin] = useState({ email: '', password: '' });
    const [previousPage, setPreviousPage] = useState<string | null>(null);
    // const [mounted, setMounted] = useState(false);


    const handleChange = (e: any) => {
        e.preventDefault();
        setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
    }


    const handleSubmit = async (e: any) => {
        e.preventDefault();
        await login(userLogin);
        router.push('/');
    }

    return (
        <div className="flex flex-col min-h-screen">
            <div className="">
                <Navbar />
            </div>
            <div className='absolute top-16 left-0 h-full'>
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="color-background min-h-screen items-center justify-center h-screen flex">
                <div className="flex flex-col flex-wrap color-navbar p-8 rounded">
                    <h1 className="text-center mb-12 text-2xl text-white font-bold">Iniciar sesión</h1>
                    <form className="flex flex-col w-fit">
                        <div className="flex mb-4">
                            <label className="w-32 text-white">Email</label>
                            <input type="text" name="email" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="flex">
                            <label className="w-32 text-white">Contraseña</label>
                            <input type="password" name="password" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="w-fit bg-white" onClick={handleSubmit}>Iniciar sesión</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}