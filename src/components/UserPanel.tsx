import Link from "next/link"

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