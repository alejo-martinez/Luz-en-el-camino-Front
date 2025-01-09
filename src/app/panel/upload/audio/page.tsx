'use client';

import Navbar from "@/components/Navbar";
import Sidebar from "@/components/Sidebar";
import { useRouter } from "next/navigation";

import { useState, useEffect } from "react";

import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "@/context/SessionContext";

import api from "@/app/utils/axiosInstance";

import { toast } from "react-toastify";



const UploadAudio = () => {
    const { showSidebar } = useSidebar();
    const { usuario, loading } = useSession();
    const router = useRouter();

    const [selectedFile, setSelectedFile] = useState<File | null>(null);
    const [title, setTitle] = useState<string | null>(null);

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0];
        setSelectedFile(file || null);
    };

    const handleTitle = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        setTitle(e.target.value);
    }

    const handleUpload = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        if (!selectedFile) {
            alert("Por favor, selecciona un archivo");
            return;
        }

        const formData = new FormData();
        formData.append("file", selectedFile);
        if (title) formData.append("title", title);


        try {
            const response = await api.post('/api/audio', formData, {
                headers: {
                    'Content-Type': 'multipart/form-data', // Este encabezado es automático cuando usas FormData
                },
            });

            toast.success(response.data.message, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            });
        } catch (error) {
            console.error("Error al subir el archivo:", error);
        }
    };

    useEffect(() => {
        if (!loading) {
            if (!usuario || usuario.rol !== 'admin') router.push('/');
        }
    }, [loading]);

    return (
        <div>
            <div className="absolute top-16 left-0 h-full">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="color-background min-h-screen">

                <div className="">
                    <Navbar />
                </div>
                <div className="color-background min-h-screen items-center justify-center h-screen flex flex-col">
                    <div className="color-navbar text-white p-8 rounded">

                        <h1 className="text-center mb-8 text-2xl font-bold">Subir audio</h1>
                        <form>

                            <div className="flex flex-col items-center">
                                <div className="flex flex-col items-center gap-12">
                                    <div className="flex justify-between w-full">
                                        <label>Título</label>
                                        <input type="text" onChange={handleTitle} name="title" className="p-px rounded text-slate-800" />
                                    </div>

                                    <div className="container">
                                        <div className="header">
                                            <svg viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                <g
                                                    id="SVGRepo_tracerCarrier"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <g id="SVGRepo_iconCarrier">
                                                    <path
                                                        d="M7 10V9C7 6.23858 9.23858 4 12 4C14.7614 4 17 6.23858 17 9V10C19.2091 10 21 11.7909 21 14C21 15.4806 20.1956 16.8084 19 17.5M7 10C4.79086 10 3 11.7909 3 14C3 15.4806 3.8044 16.8084 5 17.5M7 10C7.43285 10 7.84965 10.0688 8.24006 10.1959M12 12V21M12 12L15 15M12 12L9 15"
                                                        stroke="#000000"
                                                        strokeWidth="1.5"
                                                        strokeLinecap="round"
                                                        strokeLinejoin="round"
                                                    />{" "}
                                                </g>
                                            </svg>{" "}

                                        </div>
                                        <label htmlFor="file" className="footer">
                                            <svg
                                                fill="#000000"
                                                viewBox="0 0 32 32"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <g id="SVGRepo_bgCarrier" strokeWidth={0} />
                                                <g
                                                    id="SVGRepo_tracerCarrier"
                                                    strokeLinecap="round"
                                                    strokeLinejoin="round"
                                                />
                                                <g id="SVGRepo_iconCarrier">
                                                    <path d="M15.331 6H8.5v20h15V14.154h-8.169z" />
                                                    <path d="M18.153 6h-.009v5.342H23.5v-.002z" />
                                                </g>
                                            </svg>
                                            <p className="text-white">{selectedFile ? `"${selectedFile.name}" seleccionado` : "Seleccionar audio"}</p>
                                        </label>
                                        <input type="file" id="file" style={{ display: 'hidden' }} onChange={handleFileChange} />
                                    </div>
                                </div>
                                <button className="bg-indigo-500 w-fit p-2 rounded mt-8" onClick={handleUpload}>Subir</button>
                            </div>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default UploadAudio;