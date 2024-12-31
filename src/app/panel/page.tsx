'use client';

import { useEffect } from "react";

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import {Ruwudu, Cairo} from 'next/font/google'

const roboto = Ruwudu({
    subsets:['arabic'],
    weight:['400']
})

const cairo = Cairo({
    subsets:['arabic'],
    weight:['400']
})

const Panel = () => {
    
    const {usuario, loading} = useSession();
    const { showSidebar } = useSidebar();
    const router = useRouter();

    const handleUpload = (option:string)=>{
        router.push(`/panel/upload/${option}`);
    }

    useEffect(()=>{
        if(!loading){
            if(!usuario || usuario.rol !== 'admin') router.push('/');
        }
    }, [loading]);

    return (
        <div>
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="min-h-screen color-background">

                <div className="">
                    <Navbar />
                </div>
                <div className="flex flex-col items-center">
                    <h1 className={`font-bold mt-8 text-5xl ${roboto.className}`}>Panel de administrador</h1>
                    <div className={`${cairo.className} flex flex-col w-fit gap-8 items-center justify-center h-screen`}>
                        <div className="flex text-white gap-8 justify-between w-full">
                            <button onClick={()=> handleUpload('frase')} className="bg-black p-4 rounded">
                                Subir frase
                            </button>
                            <button onClick={()=> handleUpload('pdf')} className="bg-black p-4 rounded">
                                Subir pdf
                            </button>
                        </div>
                        <div className="text-white flex gap-8">
                            <button onClick={()=> handleUpload('audio')} className="bg-black p-4 rounded">
                                Subir audio
                            </button>
                            <button onClick={()=> handleUpload('video')} className="bg-black p-4 rounded">
                                Subir video
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Panel;