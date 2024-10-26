'use client';

import * as React from 'react';
import { useTheme } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import PlayArrowIcon from '@mui/icons-material/PlayArrow';
import CloseIcon from '@mui/icons-material/Close';
import PauseIcon from '@mui/icons-material/Pause';
import Slider from '@mui/material/Slider';
import { useAudio } from '@/context/AudioContext';
import { formatTime } from '@/app/utils/utils';

interface PropsComponent {
    audio: {
        id: string,
        title: string,
        duration: number,
        path: string
    },
    durationS: any
}

export const MediaControlCard: React.FC<PropsComponent> = ({ audio, durationS }) => {
    const theme = useTheme();
    const { stopAudio, playAudio, pauseAudio, audioPath, title, isPlaying, duration, updateCurrentTime, currentTime, currentAudio } = useAudio();

    const audioRef = React.useRef<HTMLAudioElement | null>(null);

    const [sliderValue, setSliderValue] = React.useState(0);
    const [durationAudio, setDurationAudio] = React.useState<any>(0);


    const handleClose = () => {
        stopAudio();
    };

    const handlePlay = () => {
        if (!isPlaying) {
            playAudio(audioPath, title, duration, currentAudio);
            audioRef.current?.play(); // Inicia la reproducción
        } else {
            pauseAudio();
            audioRef.current?.pause(); // Pausa la reproducción
        }
    };


    const handleTimeUpdate = () => {

        const time = audioRef.current?.currentTime;
        if (time) {
            updateCurrentTime(time);  // Actualiza el tiempo en el contexto
            setSliderValue((time / audio?.duration) * 100);
        }
    };

    const handleSliderChange = (event: Event, newValue: number | number[]) => {
        if (audioRef.current) {
            const newTime = (newValue as number) * audio?.duration / 100;
            audioRef.current.currentTime = newTime;  // Cambia el tiempo del audio
            setSliderValue(newValue as number);  // Actualiza el valor del slider
        }
    };

    return (
        <Card sx={{ display: 'flex', backgroundColor: 'rgba(94, 5, 60, 0.801)', width:500 }}>

            <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'center', width: '100%' }}>
                <CardContent sx={{ flex: '1 0 auto', textAlign: 'center' }}>
                    <Typography component="div" variant="h5" sx={{color: 'white', fontWeight:'bold'}}>
                        {audio?.title}
                    </Typography>
                    <Typography variant="body2" component="div" sx={{color: 'white', fontWeight:'bold'}}>
                        Tiempo: {Math.floor(currentTime / 60)}:{Math.floor(currentTime % 60).toString().padStart(2, '0')} / {durationS}
                    </Typography>
                    <Slider
                        value={sliderValue} // Valor del slider basado en el tiempo actual
                        onChange={handleSliderChange} // Cambia el tiempo cuando se mueve el slider
                        aria-labelledby="continuous-slider"
                        color='info'
                    />
                </CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', pl: 1, pb: 1, justifyContent: 'center' }}>
                    <IconButton aria-label="play/pause" onClick={handlePlay}>
                        {isPlaying ?
                            <PauseIcon sx={{ height: 38, width: 38 }} />
                            :
                            <PlayArrowIcon sx={{ height: 38, width: 38 }} />
                        }
                    </IconButton>
                </Box>
                <audio
                    ref={audioRef}
                    src={audio?.path}
                    onTimeUpdate={handleTimeUpdate}
                    onEnded={() => stopAudio()} // Detiene el audio cuando termina
                />
            </Box>
        </Card>
    );
}
