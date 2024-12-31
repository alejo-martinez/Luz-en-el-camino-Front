'use client';

import InstagramIcon from '@mui/icons-material/Instagram';
import { useRouter } from 'next/navigation';

export const Footer = ()=>{

    const router = useRouter();

    const redirectInstagram = ()=>{
        router.push('https://www.instagram.com/luzen_elcamino/');
    }

    return (
        <div className='p-6'>
            <button onClick={redirectInstagram}>
                <InstagramIcon style={{ fontSize: 40, color: '#fff' }}/>
            </button>
        </div>
    )
}