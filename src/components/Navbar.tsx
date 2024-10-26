

import Link from "next/link"
import SearchBar from "./SearchBar"
import { useSidebar } from "@/context/SidebarContext";
import { useSession } from "@/context/SessionContext";
import {Cairo} from 'next/font/google'

const cairo = Cairo({
    subsets:['arabic'],
    weight:['400']
})

export default function Navbar() {

    const {setIsShown} = useSidebar()
    const {usuario, logout} = useSession();

    return (
        <div className={`flex justify-between items-center color-navbar pt-2 pb-2 ${cairo.className}`}>
            <div className="w-fit ml-4">
            <button onClick={()=> setIsShown()}>
                <span className="font-bold text-white">Menú</span>
            </button>
            </div>
            <div className="w-2/5">
                <SearchBar />
            </div>
            <div>
                {usuario?
                <div className="mr-4 flex flex-col items-center">
                    <h3 className="text-white font-bold">Hola {usuario.name} !</h3>
                    <button className="text-white w-fit" onClick={logout}>Cerrar sesión</button>
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
                }
            </div>
        </div>
    )
}