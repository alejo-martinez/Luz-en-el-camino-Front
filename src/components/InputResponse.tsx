'use client';

import { useState, Fragment } from "react";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";

import { useModal } from "@/context/ModalContext";
import { DialogTitle } from "@mui/material";
import { Ruwudu, Cairo } from 'next/font/google'
import { useRouter } from "next/navigation";

const roboto = Ruwudu({
    subsets: ['arabic'],
    weight: ['400']
})

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

interface ModalProps {
    id: string
}

const ModalResponse = () => {
    const router = useRouter();

    const { open, setOpen, sendResponse } = useModal();
    const [comment, setComment] = useState('');

    const [status, setStatus] = useState(false);

    const handleComment = (e: any) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const handleSubmit = async (e: any) => {
        e.preventDefault();
        const response = await sendResponse(comment);
        if (response.status === 'succes') {
            setStatus(true);
            setTimeout(()=>{
                window.location.reload();
            }, 2000);
            // router.push(window.location.href);
            
        }
    }

    return (
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-white p-6 rounded shadow-lg max-w-md flex flex-col items-center">
                            <DialogTitle>{status ? 'Respuesta enviada !' : 'Responder comentario'}</DialogTitle>
                            {!status &&
                                <div className="flex flex-col items-center">
                                    <input
                                        type="text"
                                        className="mt-4 p-2 border rounded w-full"
                                        placeholder="Escribe tu respuesta..."
                                        value={comment}
                                        onChange={handleComment}
                                    />
                                    <button onClick={handleSubmit} className="mt-4 btn w-fit p-2 bg-black rounded text-white">Enviar</button>
                                </div>
                            }
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default ModalResponse;