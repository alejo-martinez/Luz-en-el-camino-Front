'use client';

import React, { useState } from "react";
import { useSession } from "@/context/SessionContext";
import { useModal } from "@/context/ModalContext";
import { Ruwudu, Cairo } from 'next/font/google'
import { useComent } from "@/context/ComentContext";
import { toast } from "react-toastify";

interface BoxComentsProps {
    file: any;
    type: string
}

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

export const BoxComents: React.FC<BoxComentsProps> = ({ file, type }) => {

    const { usuario } = useSession();
    const { setOpen, openComent } = useModal();
    const { deleteComent } = useComent();

    const deleteComment = async (cid: string, fid: string) => {
        const response = await deleteComent(fid, type, cid);
        console.log(response);
        if (response.status === 'succes') {
            toast.success('Comentario eliminado!', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            });
            setTimeout(() => {
                window.location.reload();
            }, 2000);
        }
    }

    return (
        <div className={`w-4/5 bg-white flex flex-col gap-y-1 justify-center justify-self-center p-8 rounded-ss-lg rounded-se-lg ${cairo.className} max-xxs:text-xs`}>
            {file.comments.map((comment: any, index: number) => {
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
                                {(usuario && usuario.rol === 'admin') &&
                                <div className="flex justify-between">
                                    {(!comment.comment.response) &&
                                    <button className='bg-blue-800 text-white p-1 rounded mt-2' onClick={() => openComent(true, comment.comment._id)}>Responder</button>
                                
                                }
                                <button className='bg-red-700 text-white p-1 rounded mt-2' onClick={()=> deleteComment(comment.comment._id, file._id)}>Eliminar</button>
                                
                                </div>
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
    )
}