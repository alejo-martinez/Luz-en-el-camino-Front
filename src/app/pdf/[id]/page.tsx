'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import PdfViewer from '@/components/PdfViewer';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';

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
    const [pdf, setPdf] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const {showSidebar} = useSidebar();

    const formatDate = (date: any) => {
        const newDate = new Date(date);
        return `${newDate.getDate()}/${newDate.getMonth() + 1}/${newDate.getFullYear()} ${String(newDate.getHours()).padStart(2, '0')}:${String(newDate.getMinutes()).padStart(2, '0')}`
    };

    useEffect(() => {
        const getData = async () => {
            if (id) {
                const doc = await fetchData(id as string); // Esperar a que fetchData resuelva la promesa
                doc.comments.forEach((comment: any) => {
                    // comment.comment.text = 
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
                        <h2 className='text-white text-center font-bold text-2xl mt-4'>{pdf.title}</h2>
                    </div>
                    <div className='grid flex-col justify-center w-full'>
                        <PdfViewer fileUrl={pdf.path} />
                        {pdf.comments.length > 0 ?
                            <div className='w-4/5 bg-white flex flex-col gap-y-1 justify-center justify-self-center p-8 rounded-ss-lg rounded-se-lg'>
                                {pdf.comments.map((comment: any, index: number) => {
                                    console.log(comment)
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
                        <div className='flex justify-center'>
                            <form className='flex justify-center w-4/5 bg-white border-2 border-solid'>
                                <input type="text" className='w-full p-1' placeholder='Escribe un comentario...' />
                                <button className='bg-black p-1 rounded-s color-cards text-white font-bold'>Enviar</button>
                            </form>
                        </div>
                    </div>
                </div>
            }
        </div>
    )
}

export default PdfPage;