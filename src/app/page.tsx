'use client';
import Link from "next/link";

//Componentes
import Navbar from "@/components/Navbar";
import SearchBar from "@/components/SearchBar";
import UserPanel from "@/components/UserPanel";
import Initial from "@/components/Home";
import Sidebar from "@/components/Sidebar";
import { useEffect, useState } from 'react';
// import AudioPlayer from '../components/AudioPlayer';
import { useAudio } from "@/context/AudioContext";
import { useSidebar } from "@/context/SidebarContext";
import Loading from "@/components/Loading";

export default function Home() {
  const [showPlayer, setShowPlayer] = useState(false);
  const [loading, setLoading] = useState(true);
  const { showSidebar } = useSidebar();
  const { isPlaying } = useAudio()

  const audioData = {
    title: 'Título del Audio',
    path: '/ruta/al/audio.mp3', // Cambia esto por la ruta real de tu audio
  };

  useEffect(() => {
    setLoading(false);
  }, []);

  if (loading) return <Loading />

  return (
    <div className="flex min-h-screen">
      <div className="absolute top-16 left-0 h-full">
        {showSidebar &&
          <Sidebar />
        }
      </div>
      <div>

        <div className="">
          <Navbar />
        </div>
        <div className="color-background min-h-full">
          <Initial />
        </div>
      </div>
    </div>
  );
}
