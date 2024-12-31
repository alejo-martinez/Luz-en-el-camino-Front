'use client';

import { useSidebar } from "@/context/SidebarContext";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

import Swal from 'sweetalert2';
import Link from "next/link";

import api from "@/app/utils/axiosInstance";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "@/context/SessionContext";
import {Ruwudu, Cairo} from 'next/font/google'
import { toast } from "react-toastify";

const roboto = Ruwudu({
    subsets:['arabic'],
    weight:['400']
})

const cairo = Cairo({
    subsets:['arabic'],
    weight:['400']
})

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

export default function PasswordReset() {

    const router = useRouter();

    const { showSidebar } = useSidebar();
    const { login } = useSession();
    const [email, setEmail] = useState('');

        const handleChange = (e: any) => {
            e.preventDefault();
            setEmail(e.target.value);
        }
    
    
        const handleSubmit = async (e: any) => {
                e.preventDefault();
                const response = await api.post(`${baseUrl}/api/session/reset`, {email:email});
                if(response.data.status === 'succes'){
                    Swal.fire({
                        title: 'Código enviado !',
                        text: 'Enviamos un email con un código a su correo eléctronico.',
                        icon: 'success',
                        confirmButtonText: 'Aceptar'
                    })
                }
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
                    <h1 className="text-center mb-12 text-2xl text-white font-bold">Recuperar contraseña</h1>
                    <form className="flex flex-col w-fit">
                        <div className="flex mb-4 items-center">
                            <label className="w-32 text-white">Ingrese su email</label>
                            <input type="text" name="email" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="w-fit bg-white p-1 rounded font-bold" onClick={handleSubmit}>Enviar código</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}