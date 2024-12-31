import Link from "next/link"
import {Ruwudu, Cairo} from 'next/font/google'

const roboto = Ruwudu({
    subsets:['arabic'],
    weight:['400']
})

const cairo = Cairo({
    subsets:['arabic'],
    weight:['400']
})

export default function UserPanel() {

    return (
        <div>
            <div>
                <Link href={"/singin"}>
                    <span>Iniciar sesión</span>
                </Link>
            </div>
            <div>
                <Link href={'/singup'}>
                    <span>Registrarse</span>
                </Link>
            </div>
        </div>
    )
}