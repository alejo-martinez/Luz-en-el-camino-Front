"use client";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';
import { useRouter } from 'next/navigation';
import { Ruwudu, Cairo } from 'next/font/google'
import { useState, useEffect } from 'react';

const roboto = Ruwudu({
  subsets: ['arabic'],
  weight: ['400']
})

const cairo = Cairo({
  subsets: ['arabic'],
  weight: ['400']
})

interface PDFViewerProps {
  fileUrl: string;
  frase: boolean;
}

const PdfViewer: React.FC<PDFViewerProps> = ({ fileUrl, frase }) => {
  const [scale, setScale] = useState(1.2);
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  const router = useRouter();

  const downloadPdf = () => {
    router.push(fileUrl)
  }

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if(width < 375) setScale(0.4)
      else if (width < 640) setScale(0.6); // Para pantallas pequeñas
      else if (width < 768) setScale(0.8); // Pantallas medianas
      else setScale(1.2); // Pantallas grandes
    };

    handleResize(); // Llamar inicialmente
    window.addEventListener("resize", handleResize); // Escuchar cambios de tamaño

    return () => {
      window.removeEventListener("resize", handleResize); // Limpiar listener
    };
  }, []);

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* PDF Viewer */}
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <div
          className="w-screen max-w-4xl h-[80vh] p-2 md:h-[75vh] lg:h-[80vh] lg:p-4 overflow-hidden"
          style={{ borderRadius: '8px' }}
        >
          <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} defaultScale={scale} />
        </div>
        {!frase && 
        <button className="button mt-4 mb-4" onClick={downloadPdf}>
          <svg
            strokeLinejoin="round"
            strokeLinecap="round"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            viewBox="0 0 24 24"
            height={40}
            width={40}
            className="button__icon"
            xmlns="http://www.w3.org/2000/svg"
            >
            <path fill="none" d="M0 0h24v24H0z" stroke="none" />
            <path d="M4 17v2a2 2 0 0 0 2 2h12a2 2 0 0 0 2 -2v-2" />
            <path d="M7 11l5 5l5 -5" />
            <path d="M12 4l0 12" />
          </svg>
          <span className="button__text">Descargar contenido</span>
        </button>
          }
        {/* Navigation Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <GoToPreviousPage>
            {(props) => (
              <button
                className={`px-4 py-2 text-white bg-blue-500 rounded ${props.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                onClick={props.onClick}
                disabled={props.isDisabled}
              >
                Página anterior
              </button>
            )}
          </GoToPreviousPage>

          <GoToNextPage>
            {(props) => (
              <button
                className={`px-4 py-2 text-white bg-blue-500 rounded ${props.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
                  }`}
                onClick={props.onClick}
                disabled={props.isDisabled}
              >
                Página siguiente
              </button>
            )}
          </GoToNextPage>
        </div>
      </Worker>
    </div>
  );
};

export default PdfViewer;
