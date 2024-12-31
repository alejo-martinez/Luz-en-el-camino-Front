'use client';

import React,{Suspense} from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState} from "react";

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Cairo } from 'next/font/google';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';


import { useSidebar } from '@/context/SidebarContext';
import { formatTime } from '../utils/utils';

import PlayArrowIcon from '@mui/icons-material/PlayArrow';


const cairo = Cairo({
    subsets: ['latin'],
    weight: ['400']
})

interface Audio {
    _id: string;
    title: string;
    path: string;
    key: string;
    duration: number | string;
    created_at: string;
    comments: [
        { comment: string, _id: string }
    ] | []
};

interface InfoFetch {
    pdfs: Audio[];
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
}

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

export default function Audios() {

    const { showSidebar } = useSidebar();
    const [audios, setAudios] = useState<Audio[]>([]);
    
    const [infoFetch, setInfoFetch] = useState<InfoFetch | null>(null);
    const [minWidth, setMinWidth] = useState(false);
    const [loading, setLoading] = useState(true);
    const [filter, setFilter] = useState('');
    const searchParams = useSearchParams();
    const myQueryParam: string | null | number = searchParams.get('page');

    


    const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFilter(e.target.value);
    }

    const fetchData = async (queryPage: number | string = 1, queryFilter: string) => {
        try {
            const response = await fetch(`${baseUrl}/api/audio?page=${queryPage === null ? 1 : queryPage}&${queryFilter && `sort=${queryFilter}`}`);
            const data = await response.json();
            data.payload.docs.map((audio: Audio) => {
                audio.duration = formatTime(Number(audio.duration))
            })
            setInfoFetch(data.payload);
            setAudios(data.payload.docs)
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        if(myQueryParam) fetchData(myQueryParam, filter);
        
        setLoading(false);
    }, [myQueryParam, filter]);

    useEffect(()=>{
        const width = window.innerWidth;
        if(width <= 425) setMinWidth(true);
    },[])


    return (
        <Suspense fallback={<div>Loading...</div>}>

        <div className='color-background'>
            <div className=''>
                <Navbar />
            </div>
            <div className='absolute top-16 left-0 h-full'>
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            {loading ?
                <div className=''>
                    <p className='text-center text-slate-800 font-bold'>Cargando...</p>
                </div>
                :
                
                <div className={`grid flex-col min-h-screen initial aling-center ${cairo.className}`}>
                    <div className='flex flex-col items-center mt-12'>
                        <img src="/mandalavioleta.webp" width={150} alt="" className='rounded-lg' />

                        <p className='text-center w-2/5 text-slate-800 font-bold mt-8'>Acá te comparto algunas palabras que sanan, para que las hagas tuyas y armes de a poco las propias. Hay meditaciones que te guían para activar tu luz y fortaleza.</p>
                    </div>

                    {audios.length === 0 ?
                        <p className='text-center text-black font-bold font-l'>No hay audios disponibles</p>
                        :
                        <div className={`grid flex-col ${!minWidth && 'm-2'} justify-items-center`}>
                            <div className='flex justify-center items-center mt-12'>
                                {infoFetch?.hasPrevPage &&
                                    <div className='flex'>
                                        <button className='text-slate-800 mr-4'>
                                            <Link href={`/audios?page=${infoFetch.prevPage}`}>
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
                                            <Link href={`/audios?page=${infoFetch.nextPage}`}>
                                                <ArrowRightIcon className='h-4 w-4' />
                                            </Link>
                                            
                                        </button>
                                    </div>
                                }
                            </div>
                            <div className="ml-4 mb-4 mt-6 gap-4 flex items-center justify-self-start">
                                <span className={`text-xp`}>Ordenar por:</span>
                                <select name="filter" className="text-center rounded" defaultValue={'none'} onChange={handleFilter}>
                                    <option value="oldest">Mas antiguos</option>
                                    <option value="newest">Mas recientes</option>
                                    {/* <option value="coments">Mas comentados</option> */}
                                    <option value="alfabetic">A-Z</option>
                                    <option value="reversed">Z-A</option>
                                </select>
                            </div>
                            <table className='color-bg-table rounded w-full text-slate-900 font-bold mt-12 max-xs:text-xs'>
                                <thead>
                                    <tr>
                                        {!minWidth && 
                                        <th className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>#</th>
                                    }
                                        <th className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>Título</th>
                                        <th className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>Comentarios</th>
                                        <th className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>Duración</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {audios.map((audio, index) => {
                                        return (
                                            <tr key={`${audio._id}${index}`} className='text-center'>
                                                {!minWidth &&
                                                <td className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>{index}</td>
                                            }
                                                <td className='first-letter:uppercase py-3 px-4 max-xxs:py-1 max-xxs:px-2'>{audio.title}</td>
                                                <td className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>{audio.comments.length}</td>
                                                <td className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'>{audio.duration}</td>
                                                <td className='py-3 px-4 max-xxs:py-1 max-xxs:px-2'><Link href={`/audio/${audio._id}`}>{minWidth ? <PlayArrowIcon sx={{ height: 10, width: 10 }} /> : 'Escuchar'}</Link></td>
                                            </tr>
                                        )
                                    })}
                                </tbody>
                            </table>
                        </div>
                    }
                </div>
            }
        </div>
                    </Suspense>
    )
}