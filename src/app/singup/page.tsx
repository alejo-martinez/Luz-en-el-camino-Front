'use client';

import { useSidebar } from "@/context/SidebarContext";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Swal from 'sweetalert2';

import api from "../utils/axiosInstance";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "@/context/SessionContext";
import {Ruwudu, Cairo} from 'next/font/google'

const roboto = Ruwudu({
    subsets:['arabic'],
    weight:['400']
})

const cairo = Cairo({
    subsets:['arabic'],
    weight:['400']
})

export default function SignUp() {

    const router = useRouter();

    const { showSidebar } = useSidebar();
    const { register } = useSession();
    const [userRegister, setUserRegister] = useState({name:'', email: '', password: '', confirmPassword:'' });
    const [previousPage, setPreviousPage] = useState<string | null>(null);
    // const [mounted, setMounted] = useState(false);


    const handleChange = (e: any) => {
        e.preventDefault();
        setUserRegister({ ...userRegister, [e.target.name]: e.target.value });
    }


    const handleSubmit = async (e: any) => {
            e.preventDefault();
            if(userRegister.password !== userRegister.confirmPassword){
                Swal.fire({
                    title:'Error',
                    text:`Las contraseñas no coinciden`,
                    icon:'error',
                    showCloseButton:true
                })
            } else{
                const response = await register({name:userRegister.name, email: userRegister.email, password: userRegister.password});
                console.log(response.response)
                if(response.response.data.status === 'error'){
                    Swal.fire({
                        title:'Error',
                        text:`${response.response.data.error}`,
                        icon:'error',
                        showCloseButton:true
                    })
                }
            }
                
        // router.push('/singin');
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
                    <h1 className="text-center mb-12 text-2xl text-white font-bold">Registrarse</h1>
                    <form className="flex flex-col w-fit">
                        <div className="flex mb-4 items-center">
                            <label className="w-32 text-white">Nombre</label>
                            <input type="text" name="name" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="flex mb-4 items-center">
                            <label className="w-32 text-white">Email</label>
                            <input type="text" name="email" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="flex mb-4 items-center">
                            <label className="w-32 text-white">Contraseña</label>
                            <input type="password" name="password" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-white">Confirmar contraseña</label>
                            <input type="password" name="confirmPassword" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="w-fit bg-white p-1 rounded font-bold" onClick={handleSubmit}>Registrarse</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}