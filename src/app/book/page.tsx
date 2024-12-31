'use client';

import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import PdfViewer from "@/components/PdfViewer"



import { useSidebar } from "@/context/SidebarContext";

import { Ruwudu } from 'next/font/google'

const roboto = Ruwudu({
    subsets: ['arabic'],
    weight: ['400']
})



export default function Book() {
    const { showSidebar } = useSidebar();

    return (
        <div className="color-background">
            <div className="absolute top-16 left-0 h-full z-10">
                {showSidebar &&
                    <Sidebar />
                }
            </div>
            <div className="">
                <Navbar />
            </div>
            <div className="min-h-screen initial z-0">
                <h1 className={`max-xs:text-3xl text-5xl mt-16 text-slate-800 font-bold text-center ${roboto.className}`}>La llamada inevitable</h1>
                <div>
                    <PdfViewer fileUrl="https://luzenelcaminopdfs.s3.us-east-2.amazonaws.com/librocompleto.pdf" frase={false}/>
                </div>
            </div>
        </div>
    )
}