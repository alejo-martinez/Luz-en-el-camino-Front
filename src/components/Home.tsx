
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

export default function Initial() {
    return (
        <div className="grid flex-col min-h-full">
            <div className="text-center mb-32">
                <h1 className={`text-6xl mt-16 font-bold text-slate-800 ${roboto.className}`}>Luz en el camino</h1>
            </div>

            <div className="p-4 h-32 color-navbar shadow-2xl rounded mb-32 flex flex-col content-center flex-wrap w-fit justify-self-center justify-between border-double border-4 border-white text-white">
                <div>
                <p className={`text-center ${cairo.className}`}>Este es el inicio del camino...</p>
                </div>
                <div>
                    <Link href="https://luzenelcaminopdfs.s3.us-east-2.amazonaws.com/La+noche+oscura.pdf">
                        <p className={`text-center text-lg ${cairo.className}`}>Leer "La noche oscura"</p>
                    </Link>
                </div>
            </div>

            <div className="w-3/5 h-fit justify-self-center p-5 rounded-lg shadow-lg shadow-black color-navbar">
                <p className={`text-white ${cairo.className} text-center text-lg`}>Esta página es un espacio que nace de mi corazón, son mis palabras, las que mi alma me trajo como camino de sanación. Hoy deseo compartirlas y hacer de este espacio un lugar nuestro. Hay textos, escritos de mi alma para tu alma si le resuenan, y hay audios, ya que sentí que escuchar una voz amiga muchas veces nos calma. Espero que lo disfrutes y sientas y que lo hagas tu espacio. Te leo, te agradezco y te abrazo.</p>
            </div>

            <div className="flex justify-center mt-32">
                <img src="/piespiedras.webp" alt="" className="w-32 h-34"/>
            </div>
        </div>
    )
}