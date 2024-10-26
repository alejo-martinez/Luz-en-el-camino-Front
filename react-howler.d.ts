// types/react-howler.d.ts
declare module 'react-howler' {
    import { Component } from 'react';
  
    interface ReactHowlerProps {
      src: string | string[]; // La fuente del archivo de audio
      playing?: boolean; // Controla si el audio está en reproducción
      loop?: boolean; // Repite el audio en bucle
      mute?: boolean; // Silencia el audio
      volume?: number; // Volumen del audio (entre 0.0 y 1.0)
      preload?: boolean; // Pre-carga el archivo de audio
      onLoad?: (duration: number) => void;
 // Evento disparado cuando el audio se carga
      onPlay?: () => void; // Evento disparado cuando el audio comienza a reproducirse
      onEnd?: () => void; // Evento disparado cuando el audio finaliza
      onPause?: () => void; // Evento disparado cuando el audio se pausa
      onSeek?: () => void;
    }
  
    export default class ReactHowler extends Component<ReactHowlerProps> {}
  }
  