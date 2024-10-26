'use client';

import { useEffect, useState } from "react";

import Sidebar from "@/components/Sidebar";
import Navbar from "@/components/Navbar";
import { useSearchParams } from 'next/navigation';
import { useSidebar } from "@/context/SidebarContext";
import api from "../utils/axiosInstance";
import Link from "next/link";
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const Videos = () => {
    const searchParams = useSearchParams();
    let myQueryParam: any = searchParams.get('page');
    const { showSidebar } = useSidebar();

    const [videos, setVideos] = useState<any>([]);
    const [infoFetch, setInfoFetch] = useState<any>(null);

    const fetchData = async (queryPage: any = 1) => {
        const result = await api.get(`/api/video?page=${queryPage === null ? 1 : queryPage}`);
        const data = result.data;
        setVideos(data.payload.docs);
        setInfoFetch(data.payload)
        console.log(data.payload)
    }

    useEffect(() => {
        fetchData(myQueryParam);
    }, [myQueryParam])

    return (
        <div>
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="color-background ">

                <div className="">
                    <Navbar />
                </div>
                <div className="min-h-full">
                    <h1 className="text-center font-bold text-3xl mt-8 mb-8">Videos</h1>
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
                    <div className='w-full'>
                        <table className='w-full text-center text-white border shadow-lg shadow-black color-bg-table'>
                            <thead className='border'>
                                <tr>
                                    <th className='px-4 py-2 border'>Título</th>
                                    <th className='px-4 py-2 border'>Comentarios</th>
                                </tr>
                            </thead>
                            <tbody>

                                {videos?.map((video: any, index: number) => (
                                    <tr key={`${video._id}${index}`}>
                                        <td className='px-4 py-2 border font-bold text-left'>{video.title}</td>
                                        <td className='px-4 py-2 border'>{video.comments.length}</td>
                                        <td className='px-4 py-2 border'><Link href={`/video/${video._id}`}>Ver video</Link></td>

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