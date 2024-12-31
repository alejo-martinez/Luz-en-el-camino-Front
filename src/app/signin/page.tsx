'use client';

import { useSidebar } from "@/context/SidebarContext";

import { useState} from "react";
import { useRouter } from "next/navigation";

import Swal from 'sweetalert2';
import Link from "next/link";


import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSession } from "@/context/SessionContext";

interface UserLogin {
    email: string,
    password: string
}


export default function SignIn() {

    const router = useRouter();

    const { showSidebar } = useSidebar();
    const { login } = useSession();
    const [userLogin, setUserLogin] = useState<UserLogin>({ email: '', password: '' });



    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.preventDefault();
        setUserLogin({ ...userLogin, [e.target.name]: e.target.value });
    }


    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
            e.preventDefault();
            const response = await login(userLogin);
            if(response && response.response.data.status === 'error'){
                Swal.fire({
                    title:'Error',
                    text:`${response.response.data.error}`,
                    icon:'error',
                    showCloseButton:true
                })
            }
            else router.push('/');
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
                        <div className="flex mb-4 items-center">
                            <label className="w-32 text-white">Email</label>
                            <input type="text" name="email" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="flex items-center">
                            <label className="w-32 text-white">Contraseña</label>
                            <input type="password" name="password" className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                        </div>
                        <div className="mt-8 flex justify-center">
                            <button className="w-fit bg-white p-1 rounded font-bold" onClick={handleSubmit}>Iniciar sesión</button>
                        </div>
                        <div className="mt-8 flex flex-col items-center justify-center">
                            <p className="text-white"><Link href={"/singup"}>Registrarse</Link></p>
                            <p className="text-white"><Link href={"/password/reset"}>Olvidé mi contraseña</Link></p>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    )
}