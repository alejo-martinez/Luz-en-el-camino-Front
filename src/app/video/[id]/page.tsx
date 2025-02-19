'use client';

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";

import { useParams } from 'next/navigation';
import { useState, useEffect } from "react";
import { useSession } from "@/context/SessionContext";

import { useComent } from "@/context/ComentContext";
import { useSidebar } from "@/context/SidebarContext";
import api from "@/app/utils/axiosInstance";
import ModalResponse from '@/components/InputResponse';
import { Ruwudu} from 'next/font/google'
import Swal from "sweetalert2";
import { BoxComents } from "@/components/BoxComents";
import { toast } from "react-toastify";


const roboto = Ruwudu({
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

interface Video {
    _id: string
    title: string;
    path: string;
    comments: Comment[];
    key: string
}

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const formatDate = (date: Date | string) => {
    const newDate = new Date(date);
    return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
};

const ShowVideo = () => {

    const { id } = useParams();
    const { showSidebar } = useSidebar();
    const { usuario } = useSession();

    const { sendComent } = useComent()

    const [video, setVideo] = useState<Video | null>(null);
    const [coment, setComent] = useState<CommentState>({ author: '', text: '' });

    const fetchData = async (videoId: string) => {
        const response = await api(`${baseUrl}/api/video/${videoId}`);
        const data = response.data;
        data.payload.comments.forEach((comment: Comment) => {
            comment.comment.created_at = formatDate(comment.comment.created_at)
        })
        setVideo(data.payload);
    }

    const handleChange = (e:  React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setComent({ ...coment, [e.target.name]: e.target.value });
    }

    const comentVideo = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (coment.text.length < 1) Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese un comentario porfavor'
        })
        else {
            if(video){

                const date = new Date();
                const formattedDate = formatDate(date);
                const obj = { author: coment.author, text: coment.text, id: video._id, type: 'video', title: video.title };
                sendComent(obj);
                toast.success('Comentario enviado!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            })
            setComent({author:'', text:''});
            const comentarios = [...video.comments];
            comentarios.push({ comment: { author: obj.author, text: obj.text, created_at: formattedDate, _id: obj.id } });
            setVideo({...video, comments: comentarios})
        }
        }
    }

    useEffect(() => {
        if(typeof id === 'string') fetchData(id);
        
    }, [id]);

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
                    <h1 className={`font-bold text-4xl mt-8 mb-8 ${roboto.className}`}>{video?.title}</h1>
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
                    {video?.comments.length && video.comments.length > 0 ?
                        <BoxComents file={video} type="video"/>
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
                                        defaultValue={""}
                                        onChange={handleChange}
                                    />
                                </div>
                                <button className="form-submit-btn" onClick={comentVideo}>
                                    Enviar
                                </button>
                            </form>
                        </div>
                    }
                </div>
            </div>
            <ModalResponse />
        </div>
    )
}

export default ShowVideo;