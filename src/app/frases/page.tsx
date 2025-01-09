'use client';

import React, { Suspense } from 'react';

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

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

interface InfoFetch {
    frases: Frase[];
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
}


const FrasesPage = () => {

    const [loading, setLoading] = useState(true);
    const [frases, setFrases] = useState<Frase[]>([]);
    const [infoFetch, setInfoFetch] = useState<InfoFetch | null>(null);

    const { showSidebar } = useSidebar();

    const searchParams = useSearchParams();
    const myQueryParam: string | null | number = searchParams.get('page');

    const fetchData = async (queryPage: string | number = 1) => {
        try {
            const response = await fetch(`${baseUrl}/api/frase?page=${queryPage === null ? 1 : queryPage}`);
            const data = await response.json();
            console.log(data)
            setInfoFetch(data.payload);
            setFrases(data.payload.docs);

        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(myQueryParam) fetchData(myQueryParam);
        else fetchData();
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

                    <div className='flex justify-center items-center mt-12'>
                        {infoFetch?.hasPrevPage &&
                            <div className='flex'>
                                <button className='text-slate-800 mr-4'>
                                    <Link href={`/frases?page=${infoFetch.prevPage}`}>
                                        <ArrowLeftIcon className='h-4 w-4' />
                                    </Link>
                                </button>
                            </div>
                        }
                        <div>
                            <p className='text-slate-800 font-bold'>
                                {infoFetch?.page}
                            </p>
                        </div>
                        {infoFetch?.hasNextPage &&
                            <div className='flex'>
                                <button className='text-slate-800 ml-4'>
                                    <Link href={`/frases?page=${infoFetch.nextPage}`}>
                                        <ArrowRightIcon className='h-4 w-4' />
                                    </Link>

                                </button>
                            </div>
                        }
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

export default function Frases() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <FrasesPage />
        </Suspense>
    );
}