'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import PdfViewer from '@/components/PdfViewer';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';
import ModalResponse from '@/components/InputResponse';
import { useSession } from "@/context/SessionContext";

import { useComent } from '@/context/ComentContext';
import { Ruwudu } from 'next/font/google'
import Swal from 'sweetalert2';
import { toast } from 'react-toastify';
import { BoxComents } from '@/components/BoxComents';


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
  
  interface Pdf {
    _id: string
    title: string;
    path: string;
    category: 'libro' | 'escritos-con-magia' | 'el-camino-de-la-sanacion' | 'lo-que-somos' | 'nobles-verdades';
    comments: Comment[];
    key: string;
    commentsCount: number;
  }

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const fetchData = async (pdfId: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/pdf/${pdfId}`);
        const data = await response.json();
        console.log(data)
        return data.payload;

    } catch (error) {
        console.log(error)
    }
}

const PdfPage: React.FC = () => {
    const { id } = useParams();
    const [pdf, setPdf] = useState<Pdf | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const { showSidebar } = useSidebar();
    const { usuario } = useSession();

    const { sendComent } = useComent();
    const [coment, setComent] = useState<CommentState>({ author: '', text: '' });

    const formatDate = (date: Date | string) => {
        const newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setComent({ ...coment, [e.target.name]: e.target.value });
    }

    const comentPdf = (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (coment.text.length < 1) Swal.fire({
            icon: 'error',
            title: 'Error',
            text: 'Ingrese un comentario porfavor'
        })
        else {
            if(pdf){

                const date = new Date();
                const formattedDate = formatDate(date);
                const obj = { author: coment.author, text: coment.text, id: pdf._id, type: 'pdf', title: pdf.title };
                sendComent(obj);
                toast.success('Comentario enviado!', {
                    position: 'top-center',
                    autoClose: 3000,
                    hideProgressBar: true,
                    closeButton: false,
                    pauseOnHover: false
                })
                setComent({author:'', text:''});
                const comentarios = [...pdf.comments];
                comentarios.push({ comment: {_id: obj.id, author: obj.author, text: obj.text, created_at: formattedDate } });
                setPdf({...pdf, comments: comentarios})
            }
        }
    }

    useEffect(() => {
        const getData = async () => {
            if (id) {
                const doc = await fetchData(id as string);
                doc.comments.forEach((comment: Comment) => {
                    comment.comment.created_at = formatDate(comment.comment.created_at)
                })
                setPdf(doc); // Actualizar el estado con los datos
                setLoading(false); // Marcar como cargado
            }
        };

        getData(); // Llamar a la función de obtención de datos
    }, [id]);
    return (
        <div className='color-background'>
            <div className='absolute top-16 left-0 h-full z-10'>        {showSidebar &&
                <Sidebar />
            }</div>
            <div className=''><Navbar /></div>
            {loading ?
                <span>Loading...</span>
                :
                <div className='initial z-0'>

                    <div>
                        <h2 className={`text-slate-800 max-xs:text-xl text-center font-bold md:text-4xl mt-4 ${roboto.className}`}>{pdf?.title}</h2>
                    </div>
                    <div className='grid flex-col justify-center w-full'>
                        {pdf && (

                            <PdfViewer fileUrl={pdf.path} frase={false} />
                        )}
                        {pdf?.comments.length && pdf.comments.length > 0 ?
                            <BoxComents file={pdf} type='pdf'/>
                            :
                            <div>
                                <p className='text-center'>No hay comentarios</p>
                            </div>
                        }
                        {(usuario && usuario.rol === 'admin') ?
                            <div></div>
                            :
                            <div className="form-container mt-4 justify-self-center max-ss:w-full">
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
                                            
                                            onChange={handleChange}
                                        />
                                    </div>
                                    <button className="form-submit-btn" onClick={comentPdf}>
                                        Enviar
                                    </button>
                                </form>
                            </div>
                        }
                    </div>
                    <ModalResponse />
                </div>
            }
        </div>
    )
}

export default PdfPage;