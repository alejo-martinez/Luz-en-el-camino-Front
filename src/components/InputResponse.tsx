'use client';

import { useState, Fragment } from "react";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";

import { useModal } from "@/context/ModalContext";
import { DialogTitle } from "@mui/material";



const ModalResponse = () => {
   

    const { open, setOpen, sendResponse } = useModal();
    const [comment, setComment] = useState<string>('');

    const [status, setStatus] = useState<boolean>(false);

    const handleComment = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        e.preventDefault();
        setComment(e.target.value);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
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