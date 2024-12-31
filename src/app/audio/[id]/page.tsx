'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';
import api from '@/app/utils/axiosInstance';
import { useSession } from '@/context/SessionContext';
import { formatTime } from '@/app/utils/utils';
import { MediaControlCard } from '../../../components/AudioPlayer';
import ModalResponse from '@/components/InputResponse';
import { useRouter } from 'next/navigation';
import { Cairo } from 'next/font/google';
import { useComent } from '@/context/ComentContext';
import { BoxComents } from '@/components/BoxComents';
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';


const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

interface CommentState {
    author: string,
    text: string
}

interface Comment {
    _id?: string;
    comment: {
        _id: string;
        created_at: string;
        author?: string;
        text?: string;
        response?:string
    };
}

interface Audio {
    _id: string;
    title: string;
    path: string;
    key: string;
    comments: Comment[];
    duration: number;
}


const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;


const AudioPage: React.FC = () => {

    const router = useRouter();

    const { id } = useParams();
    const { showSidebar } = useSidebar();

    const { usuario } = useSession();
    const { sendComent } = useComent();

    const [audio, setAudio] = useState<Audio | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [durationSec, setDurationSec] = useState<number>(0)
    const [comment, setComment] = useState<CommentState>({ author: '', text: '' });


    const downloadAudio = () => {
        if (audio) router.push(audio.path);
    }

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComment({ ...comment, [e.target.name]: e.target.value });
    }

    const comentAudio = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (comment.text.length < 1) Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese un comentario porfavor'
        })
        else {
            if (audio) {

                const date = new Date();
                const formattedDate = formatDate(date);
                const obj = { author: comment.author, text: comment.text, id: audio._id, type: 'audio', title: audio.title };
                sendComent(obj);
                toast.success('Comentario enviado!', {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: false
                })
                setComment({ author: '', text: '' });
                const comentarios = [...audio.comments];
                comentarios.push({ comment: {_id: obj.id, author: obj.author, text: obj.text, created_at: formattedDate } });
                setAudio({ ...audio, comments: comentarios })
            }
        }
    }

    const formatDate = (date: Date | string) => {
        const newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
    };

    const fetchData = async (audioId: string) => {
        try {
            const response = await api(`${baseUrl}/api/audio/${audioId}`);
            const data = await response.data;
            console.log(data)
            data.payload.comments.forEach((comment: Comment) => {
                comment.comment.created_at = formatDate(comment.comment.created_at)
            });
            const newTime = formatTime(data.payload.duration)
            setDurationSec(Number(newTime));
            setAudio(data.payload);
            // return data.payload;

        } catch (error) {
            console.log(error)
        }
    }


    useEffect(() => {
        if(typeof id === 'string') fetchData(id);
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
                    

                        <div className={`color-background flex items-center flex-col min-h-screen justify-center ${cairo.className}`}>
                            {audio && (

                                <MediaControlCard audio={audio} durationS={durationSec} />
                            )}
                            <button className="button mt-4 mb-4" onClick={downloadAudio}>
                                <svg
                                    strokeLinejoin="round"
                                    strokeLinecap="round"
                                    fill="none"
                                    stroke="currentColor"
                                    strokeWidth="1.5"
                                    viewBox="0 0 24 24"
                                    height={40}
                                    width={40}
                                    className="button__icon"
                                    xmlns="http://www.w3.org/2000/svg"
                                >
                                    <path fill="none" d="M0 0h24v24H0z" stroke="none" />
                                    <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
                                    <path d="M7 11l5 5l5 -5" />
                                    <path d="M12 4l0 12" />
                                </svg>
                                <span className="button__text">Descargar contenido</span>
                            </button>
                            {audio?.comments.length && audio?.comments.length > 0 ?
                                <BoxComents file={audio} type='audio' />
                                :
                                <div>
                                    <p>No hay comentarios</p>

                                </div>
                            }
                            {(usuario && usuario.rol === 'admin') ?
                                <div></div>
                                :
                                <div className="form-container mt-4 max-ss:w-full">
                                    <form className="form">
                                        <div className="form-group">
                                            <label>Su nombre</label>
                                            <input type="text" placeholder="(Opcional)" name="author" onChange={handleChange} />
                                        </div>
                                        <div className="form-group">
                                            <label>Comentario</label>
                                            <textarea
                                                name="text"
                                                rows={10}
                                                cols={50}
                                                required={true}

                                                value={comment.text}
                                                onChange={handleChange}
                                            />
                                        </div>
                                        <button className="form-submit-btn" onClick={comentAudio}>
                                            Enviar
                                        </button>
                                    </form>
                                </div>
                            }
                        </div>
                    
                    }

            </div>
            <ModalResponse />
        </div>
    )
}

export default AudioPage;