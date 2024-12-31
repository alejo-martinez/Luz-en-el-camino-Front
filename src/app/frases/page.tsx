'use client';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";

import { useEffect, useState } from "react";
import { useSidebar } from '@/context/SidebarContext';
import { Cairo } from 'next/font/google';

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;
const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

interface Frase {
    _id: string;
    created_at: Date;
    path: string;
    title: string;
    key: string;
  }

export default function Frases() {

    const [loading, setLoading] = useState(true);
    const [frases, setFrases] = useState<Frase[]>([]);
    
    const { showSidebar } = useSidebar();

    const searchParams = useSearchParams();
    const myQueryParam: string | null | number = searchParams.get('page');

    const fetchData = async (queryPage: number = 1) => {
        try {
            const response = await fetch(`${baseUrl}/api/frase?page=${queryPage === null ? 1 : queryPage}`);
            const data = await response.json();
            setFrases(data.payload.docs);
            
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        fetchData();
        setLoading(false);
    }, [myQueryParam]);

    return (
        <div className="min-h-screen color-background">
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="navbar">
                <Navbar />
            </div>
            {loading ?
                <p className='text-center text-white font-bold'>Cargando...</p>
                :
                <div className={`initial ${cairo.className} min-h-screen`}>
                    <div className="flex flex-col justify-center w-full items-center mt-16">
                        <img src="/apartado-frases-para-meditar.jpg" width={200} alt="" className="rounded" />
                        <p className="text-white max-xs:text-sm text-lg text-center w-2/5 p-3 color-navbar mt-14 shadow-lg shadow-black">Aquí les comparto frases muy breves para que las lleves al corazón cada día y sientas cada palabra. Quizás ayudan a comenzar el proceso de cambio que nos guiará a la paz interior.</p>
                    </div>

                    <div className='flex max-xs:justify-center justify-between flex-wrap gap-4 mt-12'>
                        {frases.map((frase: Frase, index: number) => {
                            return (
                                <div key={`${frase._id}${index}`} className={`color-navbar w-64 p-4 ml-8 mr-8 shadow-lg shadow-black text-white text-center ${cairo.className}`}>
                                    <h4>{frase.title}</h4>
                                    <Link href={`/frase/${frase._id}`}>
                                        <p className='font-bold'>Ir a leer</p>
                                    </Link>
                                </div>
                            )
                        })}
                    </div>
                </div>
            }

        </div>
    )
}