'use client';

import Sidebar from "@/components/Sidebar"
import Navbar from "@/components/Navbar"
import PdfViewer from "@/components/PdfViewer"

import AudioPlayer from "@/components/AudioPlayer"
import { useAudio } from "@/context/AudioContext"
import { useSidebar } from "@/context/SidebarContext";

export default function Book() {
    const {showSidebar} = useSidebar();
    // const {isPlaying} = useAudio();

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
                <h1 className="text-4xl mt-16 text-white font-bold text-center">La llamada inevitable</h1>
                <div>
                    <PdfViewer fileUrl="https://luzenelcaminopdfs.s3.us-east-2.amazonaws.com/librocompleto.pdf" />
                </div>
                {/* {isPlaying &&
                    <div className="w-full">
                        <AudioPlayer />
                    </div>
                } */}
            </div>
        </div>
    )
}