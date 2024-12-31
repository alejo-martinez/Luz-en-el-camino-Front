'use client';

import Link from "next/link"
import SearchBar from "./SearchBar"
import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "@/context/SessionContext";
import { useRouter } from "next/navigation";
import { Cairo } from 'next/font/google'
import InstagramIcon from '@mui/icons-material/Instagram';

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

export default function Navbar() {
    const router = useRouter();

    const { setIsShown } = useSidebar()
    const { usuario, logout, loading } = useSession();

    const closeSession = async() => {
        const response = await logout();
        // router.push('/');
        if(response.status === 'succes') window.location.reload();
        
    }


    return (
        <div className={`flex justify-between items-center color-navbar pt-2 pb-2 ${cairo.className}`}>
            <div className="w-fit ml-4">
                <button onClick={() => setIsShown()}>
                    <span className="font-bold text-white">Menú</span>
                </button>
            </div>
            <div>
                {!loading? usuario ?
                    <div className="mr-4 flex flex-col items-center">
                        <h3 className="text-white font-bold">Hola {usuario.name} !</h3>
                        <button className="text-white w-fit" onClick={closeSession}>Cerrar sesión</button>
                    </div>
                    :
                    <ul className="flex-col justify-between content-center">
                        <li className="justify-center">
                            <Link href={"/signin"}>
                                <span className="text-white font-bold mr-4">Iniciar sesión</span>
                            </Link>
                        </li>
                        <li >
                            <Link href={"/singup"}>
                                <span className="text-white font-bold mr-4">Registrarse</span>
                            </Link>
                        </li>
                    </ul>
                :
                'Cargando...'}
            </div>
        </div>
    )
}