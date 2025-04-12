'use client';

import React, { Suspense } from "react";

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSearchParams } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import api from "../utils/axiosInstance";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Ruwudu, Cairo } from 'next/font/google'
import { useSession } from "@/context/SessionContext";
import { toast } from "react-toastify";


const roboto = Ruwudu({
    subsets: ['arabic'],
    weight: ['400']
})

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})


interface Video {
    _id: string
    title: string;
    path: string;
    comments: Comment[];
    key: string
}

interface InfoFetch {
    videos: Video[];
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
}

const VideosPage = () => {
    const searchParams = useSearchParams();
    const myQueryParam: string | null | number = searchParams.get('page');

    const {usuario} = useSession();

    const { showSidebar } = useSidebar();

    const [videos, setVideos] = useState<Video[]>([]);
    const [infoFetch, setInfoFetch] = useState<InfoFetch | null>(null);
    const [filter, setFilter] = useState('');
    const [minWidth, setMinWidth] = useState(false);

    const fetchData = async (queryPage: number | string = 1, queryFilter: string = 'none') => {
        const result = await api.get(`/api/video?page=${queryPage === null ? 1 : queryPage}&${queryFilter && `sort=${queryFilter}`}`);
        const data = result.data;
        setVideos(data.payload.docs);
        setInfoFetch(data.payload)
    }

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFilter(e.target.value);
    }

    const deleteVideo = async(e: React.MouseEvent<HTMLButtonElement>, id:string)=>{
        e.preventDefault();
        const response = await api.delete(`/api/video/delete/${id}`);
        const data = response.data;
        if(data.status === 'success'){
            toast.success(data.message,{
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            })
            window.location.reload()
        }
    }

    useEffect(() => {
        fetchData(myQueryParam || 1, filter);

    }, [myQueryParam, filter])

    useEffect(() => {
        const width = window.innerWidth;
        if (width <= 620) setMinWidth(true);
    }, [])

    return (

            <div>
                <div className="absolute top-16 left-0 h-full">
                    {showSidebar &&
                        <Sidebar />
                    }
                </div>
                <div className="color-background min-h-screen">

                    <div className="">
                        <Navbar />
                    </div>
                    <div className="">
                        <h1 className={`text-center font-bold text-3xl mt-8 mb-8 ${roboto.className}`}>Videos</h1>
                        <div className='flex justify-center mb-5'>
                            {infoFetch?.hasPrevPage &&
                                <div className='flex'>
                                    <button className='text-slate-800 mr-4'>
                                        <Link href={`/videos?page=${infoFetch.prevPage}`}>
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
                                        <Link href={`/videos?page=${infoFetch.nextPage}`}>
                                            <ArrowRightIcon className='h-4 w-4' />
                                        </Link>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className={`w-full ${cairo.className}`}>
                            <div className="ml-4 mb-4 gap-4 flex items-center">
                                <span className={`text-xp`}>Ordenar por:</span>
                                <select name="filter" className="text-center rounded" defaultValue={'none'} onChange={handleFilter}>
                                    <option value="oldest">Mas antiguos</option>

                                    <option value="newest">Mas recientes</option>
                                    {/* <option value="coments">Mas comentados</option> */}
                                    <option value="alfabetic">A-Z</option>
                                    <option value="reversed">Z-A</option>
                                </select>
                            </div>
                            <table className='w-full text-center text-slate-900 font-bold border shadow-lg shadow-black color-bg-table max-s:text-xs'>
                                <thead className='border'>
                                    <tr>
                                        <th className='px-4 py-2 border'>Título</th>
                                        <th></th>
                                        {!minWidth &&
                                            <th className='px-0.5 py-2 border max-w-10'>Comentarios</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>

                                    {videos?.map((video: Video, index: number) => (
                                        <tr key={`${video._id}${index}`}>
                                            <td className='px-4 py-2 border font-bold text-left'>{(usuario && usuario.rol === 'admin') && <button className="p-1 bg-red-500 rounded cursor-pointer" onClick={(e)=> deleteVideo(e, video._id)}>X</button>} {video.title}</td>
                                            <td className='px-4 py-2 border'><Link href={`/video/${video._id}`}>Ver video</Link></td>
                                            {!minWidth &&
                                                <td className='px-0.5 py-2 border max-w-10'>{video.comments.length}</td>
                                            }

                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
                </div>

            </div>
        
    )
}

export default function Videos() {
    return (
        <Suspense fallback={<div>Loading...</div>}>
            <VideosPage />
        </Suspense>
    );
}