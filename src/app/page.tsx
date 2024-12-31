'use client';

//Componentes
import Navbar from "@/components/Navbar";
import Initial from "@/components/Home";
import Sidebar from "@/components/Sidebar";

import { useEffect, useState } from 'react';


import { useSidebar } from "@/context/SidebarContext";
import Loading from "@/components/Loading";

export default function Home() {

  const [loading, setLoading] = useState<boolean>(true);
  const { showSidebar } = useSidebar();



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
