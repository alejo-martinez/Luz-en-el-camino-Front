'use client';

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { useParams } from 'next/navigation';

import { useState, useEffect } from "react";

import { useSidebar } from "@/context/SidebarContext";
import api from "@/app/utils/axiosInstance";

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const formatDate = (date: any) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
};

const ShowVideo = () => {

    const { id } = useParams();
    const { showSidebar } = useSidebar();
    
    const [video, setVideo] = useState<any>(null);

    const fetchData = async(videoId:any)=>{
        const response = await api(`${baseUrl}/api/video/${videoId}`);
        const data = response.data;
        data.payload.comments.forEach((comment: any) => {
            comment.comment.created_at = formatDate(comment.comment.created_at)
        })
        setVideo(data.payload);
    }

    useEffect(()=>{
        fetchData(id);
    },[]);

    return (
        <div>
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="color-background">

                <div className="">
                    <Navbar />
                </div>
                <div className="min-h-full justify-items-center">
                    <h1 className="font-bold text-3xl mt-8 mb-8">{video?.title}</h1>
                    <div>
                        <video
                            src={video?.path}
                            width={'500px'}
                            height={'200px'}
                            autoPlay={false}
                            controls={true}
                            loop={true}
                            muted={false}
                            className="rounded-lg"
                        >
                            Tu navegador no puede reproducir este video.
                        </video>
                    </div>
                    {video?.comments.length > 0 ?
                            <div className='w-4/5 bg-white flex flex-col gap-y-1 justify-center justify-self-center p-8 rounded-ss-lg rounded-se-lg'>
                                {video.comments?.map((comment: any, index: number) => {
                                    return (
                                        <div key={index} className='border-solid border-2 border-inherit p-2'>
                                            <div className='grid flex-col'>
                                                <div className='flex'>
                                                    <p className='text-stone-900'>{comment.comment.author ? `${comment.comment.author}` : `Anónimo`}</p>
                                                </div>
                                                <div className=''>
                                                    <p className='text-stone-400'>Comentado el {comment.comment.created_at}</p>
                                                </div>
                                                <div>
                                                    <p className='text-stone-900 first-letter:uppercase'>{comment.comment.text}</p>
                                                </div>
                                                {comment.comment.response &&
                                                    <div className='mt-4'>
                                                        <div className='flex items-center'>
                                                            <img src="/piespiedras.webp" alt="" className='object-contain rounded-lg' width={50} />
                                                            <p className='text-stone-900 ml-2'>Luz en el camino respondió:</p>
                                                        </div>
                                                        <p className='text-stone-400 ml-14 first-letter:uppercase'>{comment.comment.response}</p>
                                                    </div>
                                                }

                                            </div>

                                        </div>
                                    )
                                })}
                            </div>
                            :
                            <div>
                                <p>No hay comentarios</p>
                            </div>
                        }
                        <div className='flex justify-center w-full'>
                            <form className='flex justify-center w-4/5 bg-white border-2 border-solid'>
                                <input type="text" className='w-full p-1' placeholder='Escribe un comentario...' />
                                <button className='bg-black p-1 rounded color-cards text-white font-bold'>Enviar</button>
                            </form>
                        </div>
                </div>
            </div>
        </div>
    )
}

export default ShowVideo;