'use client';
import dynamic from 'next/dynamic';
// import ReactPlayer from 'react-player';
const ReactHowler = dynamic(() => import('react-howler'), { ssr: false });

import Link from 'next/link';
import { useSearchParams } from 'next/navigation';

import { useEffect, useState, useRef } from "react";

import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Cairo } from 'next/font/google';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { FaPlay, FaPause } from 'react-icons/fa';
import { useAudio } from '@/context/AudioContext';
// import AudioPlayer from '@/components/AudioPlayer';
import { useSidebar } from '@/context/SidebarContext';
import { formatTime } from '../utils/utils';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';

// import { PlayIcon, PauseIcon, SunIcon } from '@heroicons/react/solid';
// import { MoonIcon } from '@heroicons/react/outline';

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

export default function Audios() {

    const { showSidebar } = useSidebar();
    const [audios, setAudios] = useState<Audio[]>([]);
    const { playAudio, isPlaying, stopAudio, pauseAudio, isShow, updateCurrentTime, currentAudio } = useAudio();
    const [infoFetch, setInfoFetch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const searchParams = useSearchParams();
    let myQueryParam: string | null | number = searchParams.get('page');

    const audioRef = useRef<HTMLAudioElement | null>(null);


    const fetchData = async (queryPage: any = 1) => {
        try {
            const response = await fetch(`https://luzenelcamino.com.ar/api/audio?page=${queryPage === null ? 1 : queryPage}`);
            const data = await response.json();
            data.payload.docs.map((audio: any, index: any) => {
                audio.duration = formatTime(Number(audio.duration))
            })
            setInfoFetch(data.payload);
            setAudios(data.payload.docs)
        } catch (error) {
            console.log(error);
        }
    }

    const handleSeek = (howlerInstance: any) => {
        // Obtiene el tiempo actual de reproducción con howler.seek()
        console.log('howler')
        console.log(howlerInstance);
        // const currentTime = howlerInstance.seek();

        // Actualiza el tiempo en tu contexto
        // updateCurrentTime(currentTime);
    };

    const handleTimeUpdate = (audioPlayer: any) => {

        const time = audioRef.current?.currentTime;
        if (time) updateCurrentTime(time);  // Actualiza el tiempo en el contexto
        // const currentTime = audioPlayer.seek()
    };

    const handlePlay = (audio: any, title: any, duration: any, id: string) => {
        if (!isPlaying) {
            playAudio(audio, title, duration, id);
            audioRef.current?.play(); // Inicia la reproducción
        } else {
            pauseAudio();
            audioRef.current?.pause(); // Pausa la reproducción
        }
    };

    useEffect(() => {
        fetchData(myQueryParam);
        setLoading(false);
    }, [myQueryParam]);

    const [isClient, setIsClient] = useState(false); // Verificamos si estamos en el cliente
    const [playing, setPlaying] = useState(false); // Estado para manejar la reproducción
    const [playAudioId, setPlayAudioId] = useState('');



    useEffect(() => {
        setIsClient(true); // Se activa una vez que el componente está en el cliente
    }, []);

    // const togglePlay = (title: any, path: any, duration: any, id: string) => {
    //     if (isPlaying === false) {
    //         playAudio(path, title, duration, id);
    //         setPlayAudioId(id)
    //         // setPlaying(true);
    //     } else {
    //         pauseAudio();
    //         setPlayAudioId('');
    //     }
    // };

    return (
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
                        {/* <h1>Audios</h1> */}
                        <p className='text-center w-2/5 text-slate-800 font-bold mt-8'>Acá te comparto algunas palabras que sanan, para que las hagas tuyas y armes de a poco las propias. Hay meditaciones que te guían para activar tu luz y fortaleza.</p>
                    </div>

                    {audios.length === 0 ?
                        <p className='text-center text-black font-bold font-l'>No hay audios disponibles</p>
                        :
                        <div className='grid flex-col m-2 justify-items-center'>
                            <div className='flex justify-center items-center mt-12'>
                                {infoFetch.hasPrevPage &&
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
                                        {infoFetch.page}
                                    </p>
                                </div>
                                {infoFetch.hasNextPage &&
                                    <div className='flex'>
                                        <button className='text-slate-800 ml-4'>
                                            <Link href={`/audios?page=${infoFetch.nextPage}`}>
                                                <ArrowRightIcon className='h-4 w-4' />
                                            </Link>
                                            {/* <span>{infoFetch.page + 1}</span> */}
                                        </button>
                                    </div>
                                }
                            </div>
                            <table className='color-bg-table rounded w-full text-white mt-12'>
                                <thead>
                                    <tr>
                                        <th className='py-3 px-4'>#</th>
                                        <th className='py-3 px-4'>Título</th>
                                        <th className='py-3 px-4'>Comentarios</th>
                                        <th className='py-3 px-4'>Duración</th>
                                    </tr>
                                </thead>
                                <tbody>

                            {audios.map((audio, index) => {
                                return (
                                    <tr key={`${audio._id}${index}`} className='text-center'>
                                        <td className='py-3 px-4'>{index}</td>
                                        <td className='first-letter:uppercase py-3 px-4'>{audio.title}</td>
                                        <td className='py-3 px-4'>{audio.comments.length}</td>
                                        <td className='py-3 px-4'>{audio.duration}</td>
                                        <td className='py-3 px-4'><Link href={`/audio/${audio._id}`}>Escuchar</Link></td>
                                    </tr>
                                    // <div key={audio._id}>
                                    //     <h1>{audio.title}</h1>
                                    //     <audio controls>
                                    //         <source src={audio.path} type="audio/mpeg" />
                                    //         Your browser does not support the audio element.
                                    //     </audio>
                                    // </div>
                                    // <Card sx={{ display: 'flex', backgroundColor: 'rgba(94, 5, 60, 0.801)', marginTop: 2, marginBottom: 2, width:'70%'}} key={audio._id}>
                                    
                                    //     <Box sx={{ display: 'flex', flexDirection: 'row', justifyContent: 'center', width: '100%' }}>
                                    //         <CardContent sx={{ flex: '1 0 auto'}}>
                                    //             <Box sx={{}}>
                                    
                                    //             <Typography component="div" variant="h5" sx={{fontSize:20}}>
                                    //                 {audio.title}
                                    //             </Typography>
                                    //             <Typography variant="body2" component="div">
                                    //                 {audio.duration}
                                    //             </Typography>
                                    //             </Box>
                                    //         </CardContent>
                                    //         <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: 'center' }}>
                                    //             <IconButton aria-label="play/pause" onClick={() => handlePlay(audio.path, audio.title, audio.duration, audio._id)}>
                                    //                 {isPlaying && audio._id === currentAudio ?
                                    //                     <PauseIcon sx={{ height: 38, width: 38 }} />
                                    //                     :
                                    //                     <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                                    //                 }
                                    //             </IconButton>
                                    //         </Box>
                                    //         <audio
                                    //             ref={audioRef}
                                    //             src={audio.path}
                                    //             onTimeUpdate={handleTimeUpdate}
                                    //             onEnded={() => stopAudio()} // Detiene el audio cuando termina
                                    //         />
                                    //     </Box>
                                    // </Card>
                                )
                            })}
                    </tbody>
                </table>
                        </div>
                    }
                </div>
            }
        </div>
    )
}