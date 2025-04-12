
'use client';

import Link from 'next/link';

import { useEffect, useState } from 'react';
import { useSearchParams, useParams } from 'next/navigation';

import Image from 'next/image';
import Navbar from '@/components/Navbar';
import Sidebar from '@/components/Sidebar';
import { useSidebar } from '@/context/SidebarContext';
import { ArrowLeftIcon, ArrowRightIcon } from '@heroicons/react/outline';
import { Ruwudu, Cairo } from 'next/font/google'
import api from '@/app/utils/axiosInstance';
import { toast } from 'react-toastify';
import { useSession } from '@/context/SessionContext';
import { useRouter } from 'next/navigation';

const roboto = Ruwudu({
    subsets: ['arabic'],
    weight: ['400']
})

const cairo = Cairo({
    subsets: ['arabic'],
    weight: ['400']
})

interface Pdf {
    _id: string
    title: string;
    path: string;
    category: 'libro' | 'escritos-con-magia' | 'el-camino-de-la-sanacion' | 'lo-que-somos' | 'nobles-verdades';
    comments: Comment[];
    key: string;
    commentsCount: number;
  }


interface InfoFetch {
    pdfs: Pdf[];
    page: number;
    hasPrevPage: boolean;
    hasNextPage: boolean;
    prevPage: number | null;
    nextPage: number | null;
    totalPages: number;
}
const baseUrl = process.env.NEXT_PUBLIC_URL_BACK;

const PdfCategoryPage: React.FC = () => {
    const router = useRouter();
    const { category } = useParams(); // Obtiene la categoría de la ruta
    const [pdfs, setPdfs] = useState<Pdf[]>([]); // Almacena los PDFs de la categoría
    const [infoFetch, setInfoFetch] = useState<InfoFetch | null>(null);
    const [loading, setLoading] = useState<boolean>(true);
    const [imgPath, setImgPath] = useState<string>('');
    const [filter, setFilter] = useState('');
    const [minWidth, setMinWidth] = useState(false);
    const { showSidebar } = useSidebar();

    const {usuario} = useSession();

    const searchParams = useSearchParams();
    const myQueryParam: string | null | number = searchParams.get('page');

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

    const setImg = (cat: string) => {
        switch (cat) {
            case 'el-camino-de-la-sanacion':
                setImgPath('/mirandoalcielo.webp');
                break;
            case 'lo-que-somos':
                setImgPath('/dosmanos.webp');
                break;
            case 'escritos-con-magia':
                setImgPath('/duendesobremano.webp');
                break;
            case 'nobles-verdades':
                setImgPath('/mandalaazul.webp');
                break;
        }
    }

    const handleFilter = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        setFilter(e.target.value);
    }

    const fetchPdfs = async (queryPage: number = 1, queryFilter: string) => {
        try {
            const response = await fetch(`${baseUrl}/api/pdf/pdfs/${category}?page=${queryPage === null ? 1 : queryPage}&${queryFilter && `sort=${queryFilter}`}`);
            const data = await response.json();
            // const pdfs = data.payload.docs.filter((pdf: any) => pdf.category === category);
            setPdfs(data.payload.pdfs);
            setInfoFetch(data.payload);
        } catch (error) {
            console.log(error);
        }
    }

    const deletePdf = async(e: React.MouseEvent<HTMLButtonElement>, id:string)=>{
        e.preventDefault();
        const response = await api.delete(`/api/pdf/${id}`);
        const data = response.data;
        if (data.status === 'success'){
            toast.success(data.message, {
                position: 'top-center',
                autoClose: 3000,
                hideProgressBar: true,
                closeButton: false,
                pauseOnHover: false
            })
            router.push(`/pdf-category/${category}`);
        }
    }

    useEffect(() => {
        if (category) {
            const page = myQueryParam ? Number(myQueryParam) : 1;
            fetchPdfs(page, filter);
            if(typeof category === 'string') setImg(category);

        }
        setLoading(false)
    }, [category, myQueryParam, filter, fetchPdfs]);

    useEffect(()=>{
        const width = window.innerWidth;
        if(width <= 770) setMinWidth(true);
    },[])

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
                    <div className='initial min-h-screen'>
                        <h1 className={`text-center font-bold text-slate-800 flex-wrap mt-5 mb-5 text-4xl ${roboto.className}`}>{renderCategory()}</h1>
                        <div className='grid mb-4'>
                            <Image src={imgPath} width={200} height={200} className='rounded-lg justify-self-center' alt={`imagen de ${category}`}/>
                            
                        </div>
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
                        <div className={`w-full ${cairo.className}`}>
                            <div className="ml-4 mb-4 gap-4 flex items-center">
                                <span className={`text-xp`}>Ordenar por:</span>
                                <select name="filter" className="text-center rounded" defaultValue={'none'} onChange={handleFilter}>
                                    <option value="oldest">Mas antiguos</option>
                                    <option value="newest">Mas recientes</option>
                                    {/* <option value="coments">Mas comentados</option> */}
                                    <option value="alfabetic">A-Z</option>
                                    <option value="reversed">Z-A</option>
                                </select>
                            </div>
                            <table className='w-full text-center font-bold  text-slate-900 border shadow-lg shadow-black color-bg-table max-1663:text-xs'>
                                <thead className='border'>
                                    <tr>
                                        <th className='px-4 py-2 border'>Título</th>
                                        <th className='px-4 py-2 border'></th>
                                        <th className='px-4 py-2 border'></th>
                                        {!minWidth &&
                                        <th className='px-0.5 py-2 border max-w-4'>Comentarios</th>
                                        }
                                    </tr>
                                </thead>
                                <tbody>

                                    {pdfs?.map((pdf, index) => (
                                        <tr key={`${pdf._id}${index}`}>
                                            <td className='px-4 py-2 border text-left'>{(usuario && usuario.rol === 'admin') && <button className='p-1 bg-red-500 cursor-pointer rounded' onClick={(e)=> deletePdf(e, pdf._id)}>X</button>} {pdf.title}</td>
                                            <td className='px-4 py-2 border'><Link href={`/pdf/${pdf._id}`}>Leer</Link></td>
                                            <td className='px-4 py-2 border'><Link href={`${pdf.path}`}>Descargar</Link></td>
                                            {!minWidth &&
                                            <td className='px-4 py-2 border max-w-4'>{pdf.comments.length}</td>
                                            }
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
