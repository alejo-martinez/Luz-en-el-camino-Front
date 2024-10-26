// src/pages/pdf-category/[category].tsx
'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

// import PdfViewer from '../../../components/PdfViewer';
import PdfViewer from '@/components/PdfViewer';

import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';

const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const PdfCategoryPage: React.FC = () => {
    // const router = useParams();

    const { category } = useParams(); // Obtiene la categoría de la ruta
    const [pdfs, setPdfs] = useState<any[]>([]); // Almacena los PDFs de la categoría
    const [infoFetch, setInfoFetch] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const {showSidebar} = useSidebar();

    const searchParams = useSearchParams();
    let myQueryParam: any = searchParams.get('page');

    const renderCategory = () => {
        switch (category) {
            case 'el-camino-de-la-sanacion':
                return 'El camino de la sanación'
            case 'lo-que-somos':
                return 'Lo que somos'
            case 'escritos-con-magia':
                return 'Escritos con magia';
            case 'nobles-verdades':
                return 'Nobles verdades';
        }
    }

    const fetchPdfs = async (queryPage: number = 1) => {
        try {
            const response = await fetch(`${baseUrl}/api/pdf/pdfs/${category}?page=${queryPage === null ? 1 : queryPage}`);
            const data = await response.json();
            console.log(data)
            // const pdfs = data.payload.docs.filter((pdf: any) => pdf.category === category);
            setPdfs(data.payload.pdfs);
            setInfoFetch(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(() => {
        console.log(category)
        if (category) {
            fetchPdfs(myQueryParam);
            // Aquí puedes cargar los PDFs basados en la categoría
            // Por ejemplo, podrías hacer una llamada a la API o filtrar un array local
            // const fetchedPdfs = fetchPdfsByCategory(category as string);
            // setPdfs(fetchedPdfs);
        }
        setLoading(false)
    }, [category, myQueryParam]);

    // const fetchPdfsByCategory = (category: string) => {
    //     // Simulación de PDFs por categoría. Puedes reemplazar esto con tu lógica.
    //     const pdfData = {
    //         category1: ['/path/to/pdf1.pdf', '/path/to/pdf2.pdf'],
    //         category2: ['/path/to/pdf3.pdf', '/path/to/pdf4.pdf'],
    //     };
    //     return pdfData[category] || []; // Retorna PDFs de la categoría o un array vacío
    // };

    return (
        <div className='min-h-screen color-background'>
            <div className=''>
                <Navbar />
            </div>

            <div className='absolute top-16 left-0 h-full'>
            {showSidebar && 
        <Sidebar />
        }
            </div>
            {
                loading ?
                    <p className='text-white text-center font-bold'>Cargando...</p>
                    :
                    <div className='initial'>
                        <h1 className='text-center font-bold text-slate-800 flex-wrap mt-5 mb-5 text-2xl'>{renderCategory()}</h1>
                        <div className='flex justify-center mb-5'>
                            {infoFetch?.hasPrevPage &&
                                <div className='flex'>
                                    <button className='text-slate-800 mr-4'>
                                        <Link href={`/pdf-category/${category}?page=${infoFetch.prevPage}`}>
                                            <ArrowLeftIcon className='h-4 w-4' />
                                        </Link>
                                    </button>
                                </div>
                            }
                            <div>
                                <p className='text-slate-800 font-bold'>
                                    {infoFetch?.page}
                                </p>
                            </div>
                            {infoFetch?.hasNextPage &&
                                <div className='flex'>
                                    <button className='text-slate-800 ml-4'>
                                        <Link href={`/pdf-category/${category}?page=${infoFetch.nextPage}`}>
                                            <ArrowRightIcon className='h-4 w-4' />
                                        </Link>
                                    </button>
                                </div>
                            }
                        </div>
                        <div className='w-full'>
                            <table className='w-full text-center text-white border shadow-lg shadow-black color-bg-table'>
                                <thead className='border'>
                                    <tr>
                                        <th className='px-4 py-2 border'>Título</th>
                                        <th className='px-4 py-2 border'>Comentarios</th>
                                    </tr>
                                </thead>
                                <tbody>

                                    {pdfs?.map((pdf, index) => (
                                        <tr key={`${pdf._id}${index}`}>
                                            <td className='px-4 py-2 border font-bold text-left'>{pdf.title}</td>
                                            <td className='px-4 py-2 border'>{pdf.comments.length}</td>
                                            <td className='px-4 py-2 border'><Link href={`/pdf/${pdf._id}`}>Leer</Link></td>
                                            <td className='px-4 py-2 border'><Link href={`${pdf.path}`}>Descargar</Link></td>
                                        </tr>
                                    ))}
                                </tbody>
                            </table>
                        </div>
                    </div>
            }
        </div>
    );
};

export default PdfCategoryPage;
