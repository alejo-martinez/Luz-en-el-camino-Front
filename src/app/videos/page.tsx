'use client';

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSearchParams } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import api from "../utils/axiosInstance";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Ruwudu, Cairo } from 'next/font/google'
import { Footer } from "@/components/Footer";

const roboto = Ruwudu({
    subsets: ['arabic'],
    weight: ['400']
})

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const Videos = () => {
    const searchParams = useSearchParams();
    let myQueryParam: any = searchParams.get('page');
    let filterParam: any = searchParams.get('sort')
    const { showSidebar } = useSidebar();

    const [videos, setVideos] = useState<any>([]);
    const [infoFetch, setInfoFetch] = useState<any>(null);
    const [filter, setFilter] = useState('');
    const [minWidth, setMinWidth] = useState(false);

    const fetchData = async (queryPage: any = 1, queryFilter: any = 'none') => {
        const result = await api.get(`/api/video?page=${queryPage === null ? 1 : queryPage}&${queryFilter && `sort=${queryFilter}`}`);
        const data = result.data;
        setVideos(data.payload.docs);
        setInfoFetch(data.payload)
    }

    const handleFilter = (e: any) => {
        setFilter(e.target.value);
    }

    useEffect(() => {
        fetchData(myQueryParam, filter);
    }, [myQueryParam, filter])

    useEffect(()=>{
        const width = window.innerWidth;
        if(width <= 620) setMinWidth(true);
    },[])

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

                                {videos?.map((video: any, index: number) => (
                                    <tr key={`${video._id}${index}`}>
                                        <td className='px-4 py-2 border font-bold text-left'>{video.title}</td>
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

export default Videos;