'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';

import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';

import { useRouter } from 'next/navigation';

import api from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';







const PasswordUpdate: React.FC = () => {
    const { id } = useParams();
    const router = useRouter();
    const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;


    const { showSidebar } = useSidebar();
    const [code, setCode] = useState('');
    const [validated, setValidated] = useState(false);
    const [newPassword, setNewPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');


    const handleChange = (e:React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setCode(e.target.value);
    }
    const handleChangePassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setNewPassword(e.target.value);
    }
    const handleChangeConfirmPassword = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
        e.preventDefault();
        setConfirmPassword(e.target.value);
    }

    const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await api.post(`${baseUrl}/api/session/reset/${id}`, { code: code });
        if (response.data.status === 'succes') {
            setValidated(true);
            setCode('');
        }
    }

    const handleSubmitPassword = async (e: React.MouseEvent<HTMLButtonElement>) => {
        e.preventDefault();
        const response = await api.put(`${baseUrl}/api/session/update/${id}`, { password: newPassword });
        if (response.data.status === 'succes') {
            toast.success('Contraseña actualizada !', {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            });
            setTimeout(() => {
                router.push('/signin')
            }, 3000);
        }
    }


    useEffect(() => {

    }, []);
    return (
        <div className="flex flex-col min-h-screen">
            <div className="">
                <Navbar />
            </div>
            <div className='absolute top-16 left-0 h-full'>
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="color-background min-h-screen items-center justify-center h-screen flex">
                <div className="flex flex-col flex-wrap color-navbar p-8 rounded">
                    <h1 className="text-center mb-12 text-2xl text-white font-bold">Recuperar contraseña</h1>
                    {validated ?
                        <form className="flex flex-col w-fit">
                            <div className="flex mb-4 items-center">
                                <label className="w-32 text-white">Ingrese su nueva contraseña</label>
                                <input type="password" name="newPassword" value={newPassword} className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChangePassword} />
                            </div>
                            <div className="flex mb-4 items-center">
                                <label className="w-32 text-white">Repita su contraseña</label>
                                <input type="password" name="confirmPassword" value={confirmPassword} className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChangeConfirmPassword} />
                            </div>
                            <div>
                                {(confirmPassword && (newPassword !== confirmPassword)) &&
                                    <p className='text-center text-red-600 font-bold'>Las contraseñas no coinciden</p>}
                            </div>
                            <div className="mt-8 flex justify-center">
                                {((newPassword && confirmPassword) && (newPassword === confirmPassword)) ?
                                    <button className="w-fit bg-white p-2 rounded font-bold text-black border border-gray-300 hover:bg-gray-100 active:bg-gray-200 focus:outline-none" onClick={handleSubmitPassword}>Confirmar contraseña</button>
                                    :
                                    <button className="w-fit bg-gray-300 p-2 rounded font-bold text-gray-500 cursor-not-allowed" disabled={true}>Confirmar contraseña</button>}
                            </div>
                        </form>
                        :
                        <form className="flex flex-col w-fit">
                            <div className="flex mb-4 items-center">
                                <label className="w-32 text-white">Ingrese el código</label>
                                <input type="text" name="code" value={code} className="flex-1 border border-gray-300 rounded-md text-black p-2" onChange={handleChange} />
                            </div>
                            <div className="mt-8 flex justify-center">
                                <button className="w-fit bg-white p-1 rounded font-bold" onClick={handleSubmit}>Validar código</button>
                            </div>
                        </form>
                    }
                </div>
            </div>
        </div>
    )
}

export default PasswordUpdate;