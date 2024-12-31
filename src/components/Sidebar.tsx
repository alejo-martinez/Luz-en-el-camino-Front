'use client';

import { useState} from "react";
import Link from "next/link";
import { useSidebar } from "@/context/SidebarContext";
import { Cairo } from 'next/font/google';

import InstagramIcon from '@mui/icons-material/Instagram';
import { useSession } from "@/context/SessionContext";
import {useRouter} from "next/navigation";

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

export default function Sidebar() {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const { usuario } = useSession();
    let timeoutId: NodeJS.Timeout; // Para almacenar el timeout
    const { showSidebar } = useSidebar();

    const router = useRouter();

    const handleMouseEnter = () => {
        clearTimeout(timeoutId); // Limpia cualquier timeout existente
        setIsOpen(true); // Muestra el menú
    };

    const handleMouseLeave = () => {
        // Configura un timeout para ocultar el menú
        timeoutId = setTimeout(() => {
            setIsOpen(false);
        }, 200); // Tiempo de espera antes de ocultar el menú
    };

    const redirectInstagram = () => {
        router.push('https://www.instagram.com/luzen_elcamino/');
    }


    return (
        <div className={`h-full pr-4 color-navbar ${cairo.className} ${showSidebar ? 'sidebar-enter' : 'sidebar-exit'} transition-transform duration-500 ease-in-out`}>
            <div className="ml-3">
                {/* onClick={redirectInstagram} */}
                <button title="Ir al instagram" onClick={redirectInstagram}>
                    <InstagramIcon style={{ fontSize: 40, color: '#fff' }} />
                </button>
            </div>
            <ul className="flex flex-col ml-4 w-max space-y-4 pt-5">
                <li>
                    <Link href={"/"}>
                        <span className="text-white font-bold">Inicio</span>
                    </Link>
                </li>
                <li>
                    <Link href={"/book"}>
                        <span className="text-white font-bold">Libro</span>
                    </Link>
                </li>


                <li className={`transition-transform duration-300 ease-in-out ${isOpen ? 'transform' : ''}`}>
                    <Link href={"/audios"}>
                        <span className="text-white font-bold">Audios</span>
                    </Link>
                </li>
                <li className={`transition-transform duration-300 ease-in-out ${isOpen ? 'transform' : ''}`}>
                    <Link href={"/videos"}>
                        <span className="text-white font-bold">Videos</span>
                    </Link>
                </li>
                <li className={`transition-transform duration-300 ease-in-out ${isOpen ? 'transform' : ''}`}>
                    <Link href={"/frases"}>
                        <span className="text-white font-bold">Frases para meditar</span>
                    </Link>
                </li>
                <li
                    className="relative"
                    onMouseEnter={handleMouseEnter}
                    onMouseLeave={handleMouseLeave}
                >
                    <span className="rounded cursor-pointer hover text-white font-bold transition-colors duration-200">
                        Escritos del alma
                    </span>

                    <div className={`transition-all duration-300 ease-in-out ${isOpen ? 'max-h-40' : 'max-h-0 overflow-hidden'}`}>
                        <ul className="mt-1 color-cards">
                            <li className="px-4 py-2 text-white hover cursor-pointer transition-colors duration-200">
                                <Link href="/pdf-category/escritos-con-magia"><span className="font-bold">Escritos con magia</span></Link>
                            </li>
                            <li className="px-4 py-2 text-white hover cursor-pointer transition-colors duration-200">
                                <Link href="/pdf-category/el-camino-de-la-sanacion"><span className="font-bold">El camino de la sanación</span></Link>
                            </li>
                            <li className="px-4 py-2 text-white hover cursor-pointer transition-colors duration-200">
                                <Link href="/pdf-category/lo-que-somos"><span className="font-bold">Lo que somos</span></Link>
                            </li>
                            <li className="px-4 py-2 text-white hover cursor-pointer transition-colors duration-200">
                                <Link href="/pdf-category/nobles-verdades"><span className="font-bold">Nobles verdades</span></Link>
                            </li>
                        </ul>
                    </div>
                </li>
                {(usuario && usuario.rol === 'admin') &&
                    <li className={`transition-transform duration-300 ease-in-out ${isOpen ? 'transform' : ''}`}>
                        <Link href={"/panel"}><span className="text-white font-bold">Subir contenido</span></Link>
                    </li>
                }
            </ul>
        </div>
    );
}