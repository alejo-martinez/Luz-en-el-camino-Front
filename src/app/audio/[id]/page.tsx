'use client';

import { useEffect, useState, useRef } from 'react';

import { useParams } from 'next/navigation';
import PdfViewer from '@/components/PdfViewer';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';
import api from '@/app/utils/axiosInstance';
import { useSession } from '@/context/SessionContext';
import { useAudio } from '@/context/AudioContext';
import { formatTime } from '@/app/utils/utils';
import {MediaControlCard} from '../../../components/AudioPlayer';
import ModalResponse from '@/components/InputResponse';
import { useModal } from '@/context/ModalContext';

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;


const AudioPage: React.FC = () => {


    const { id } = useParams();
    const { showSidebar } = useSidebar();
    const { isPlaying, currentAudio, playAudio, stopAudio, updateCurrentTime, pauseAudio } = useAudio();
    const {usuario} = useSession();
    const {setOpen} = useModal();
    const [audio, setAudio] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [durationSec, setDurationSec] = useState<any>(0)


    const formatDate = (date: any) => {
        const newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
    };

    const fetchData = async (audioId: any) => {
        try {
            const response = await api(`${baseUrl}/api/audio/${audioId}`);
            const data = await response.data;
            data.payload.comments.forEach((comment:any)=>{
                comment.comment.created_at = formatDate(comment.comment.created_at)
            });
            const newTime = formatTime(data.payload.duration)
            setDurationSec(newTime);
            setAudio(data.payload);
            // return data.payload;

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        fetchData(id);
        setLoading(false);
        // setAudio(result.payload);
    }, [])

    return (
        <div>
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div>
                <div className="">
                    <Navbar />
                </div>
                {loading ?
                    <p>Cargando...</p>
                    :
                    <div className='flex items-center flex-col min-h-screen justify-center h-screen'>
                        <MediaControlCard audio={audio} durationS={durationSec}/>
                        {audio?.comments.length > 0 ?
                            <div className='w-4/5 bg-white flex flex-col gap-y-1 justify-center justify-self-center p-8 rounded-ss-lg rounded-se-lg'>
                                {audio.comments?.map((comment: any, index: number) => {
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
                                                    {(usuario && usuario.rol === 'admin' && !comment.comment.response) && 
                                                    <button className='bg-black text-white p-1 rounded mt-2' onClick={()=> setOpen(true)}>Responder</button>
                                                    }
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
                }
            </div>
            <ModalResponse id={'asdasd'} />
        </div>
    )
}

export default AudioPage;