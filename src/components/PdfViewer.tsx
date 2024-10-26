"use client";

import { Worker, Viewer } from '@react-pdf-viewer/core';
import { pageNavigationPlugin } from '@react-pdf-viewer/page-navigation';
import '@react-pdf-viewer/core/lib/styles/index.css';
import '@react-pdf-viewer/page-navigation/lib/styles/index.css';

interface PDFViewerProps {
  fileUrl: string;
}

const PdfViewer: React.FC<PDFViewerProps> = ({ fileUrl }) => {
  const pageNavigationPluginInstance = pageNavigationPlugin();
  const { GoToNextPage, GoToPreviousPage } = pageNavigationPluginInstance;

  return (
    <div className="flex flex-col items-center justify-center h-screen">
      {/* PDF Viewer */}
      <Worker workerUrl={`https://unpkg.com/pdfjs-dist@3.11.174/build/pdf.worker.min.js`}>
        <div
          className="w-full max-w-4xl h-[80vh] p-2 md:h-[75vh] lg:h-[80vh] lg:p-4 overflow-hidden"
          style={{ borderRadius: '8px' }}
        >
          <Viewer fileUrl={fileUrl} plugins={[pageNavigationPluginInstance]} defaultScale={1.2} />
        </div>

        {/* Navigation Buttons */}
        <div className="mt-4 flex justify-center gap-4">
          <GoToPreviousPage>
            {(props) => (
              <button
                className={`px-4 py-2 text-white bg-blue-500 rounded ${
                  props.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
                className={`px-4 py-2 text-white bg-blue-500 rounded ${
                  props.isDisabled ? 'opacity-50 cursor-not-allowed' : 'hover:bg-blue-700'
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
