'use client';

import { useEffect, useState } from 'react';

import { useParams } from 'next/navigation';
import PdfViewer from '@/components/PdfViewer';
import Sidebar from '@/components/Sidebar';
import Navbar from '@/components/Navbar';
import { useSidebar } from '@/context/SidebarContext';


const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

interface Frase {
    created_at: Date;
    path: string;
    title: string;
    key: string;
  }

const fetchData = async (fraseId: string) => {
    try {
        const response = await fetch(`${baseUrl}/api/frase/${fraseId}`);
        const data = await response.json();
        console.log(data)
        return data.payload;

    } catch (error) {
        console.log(error)
    }
}

const PdfPage: React.FC = () => {
    const { id } = useParams();
    const [pdf, setPdf] = useState<Frase | null>(null);
    const [loading, setLoading] = useState(true);
    const {showSidebar} = useSidebar();


    useEffect(() => {
        const getData = async () => {
            if (id) {
                const doc = await fetchData(id as string); // Esperar a que fetchData resuelva la promesa
                setPdf(doc); // Actualizar el estado con los datos
                setLoading(false); // Marcar como cargado
            }
        };

        getData(); // Llamar a la función de obtención de datos
    }, [id]);
    return (
        <div className='color-background'>
            <div className='absolute top-16 left-0 h-full z-10'>        {showSidebar && 
        <Sidebar />
        }</div>
            <div className=''><Navbar /></div>
            {loading ?
                <span>Loading...</span>
                :
                <div className='initial z-0'>
                    
                    <div>
                        {pdf && (
                            <h2 className='text-slate-800 text-center font-bold text-2xl mt-4'>{pdf.title}</h2>
                        )}
                    </div>
                    <div className='grid flex-col w-full'>
                        {pdf && (
                            <PdfViewer fileUrl={pdf.path} frase={true}/>
                        )}
                    </div>
                </div>
            }
        </div>
    )
}

export default PdfPage;