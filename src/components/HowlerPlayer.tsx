// src/components/HowlerPlayer.tsx

import React, { forwardRef } from 'react';
import Howler from 'react-howler';

interface HowlerPlayerProps {
    src: string | string[];
    playing: boolean;
    onLoad: (duration: number) => void;
    // Otras props necesarias de react-howler que quieras pasar
}

const HowlerPlayer = forwardRef((props: HowlerPlayerProps, ref: React.Ref<any>) => {
    return <Howler ref={ref} {...props} />;
});

HowlerPlayer.displayName = 'HowlerPlayer'; // Para ayudar en la depuración

export default HowlerPlayer;
