'use client';

import { useEffect, useState } from "react";

interface PdfGroupProps {
    category: string;
  }

export const PdfGroup: React.FC<PdfGroupProps> = ({ category }) => { 

    const [pdfs, setPdfs] = useState();

    const fetchData = async()=>{
        try {
            const url = '';
            // const response = await 
        } catch (error) {
            console.log(error);
        }
    }

    useEffect(()=>{

    },[]);

    return (
        <div>
            <h1>{}</h1>
        </div>
    )
}