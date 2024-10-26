'use client';

import { useState, Fragment } from "react";

import { Dialog, DialogPanel, Transition } from "@headlessui/react";

import { useModal } from "@/context/ModalContext";
import { DialogTitle } from "@mui/material";

interface ModalProps{
    id: string
}

const ModalResponse = (props:ModalProps) => {
    const { open, setOpen, sendResponse } = useModal();
    const [comment, setComment] = useState('');

    const handleComment = (e:any)=>{
        e.preventDefault();
        setComment(e.target.value);
    }

    const handleSubmit = async(e:any)=>{
        e.preventDefault();
        await sendResponse(props.id, comment);
    }

    return (
        <>
            <Transition appear show={open} as={Fragment}>
                <Dialog as="div" className="relative z-10" onClose={() => setOpen(false)}>
                    <div className="fixed inset-0 bg-black bg-opacity-25" />
                    <div className="fixed inset-0 flex items-center justify-center p-4">
                        <DialogPanel className="bg-white p-6 rounded shadow-lg max-w-md flex flex-col items-center">
                            <DialogTitle>Responder comentario</DialogTitle>
                            <input
                                type="text"
                                className="mt-4 p-2 border rounded w-full"
                                placeholder="Escribe tu respuesta..."
                                value={comment}
                                onChange={handleComment}
                            />
                            <button onClick={handleSubmit} className="mt-4 btn w-fit">Enviar</button>
                        </DialogPanel>
                    </div>
                </Dialog>
            </Transition>
        </>
    )
}

export default ModalResponse;