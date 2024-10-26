
export const formatTime = (seconds: number)=> {

    // Redondeamos el número de segundos a un número entero
    const roundedSeconds = Math.floor(seconds);


    // Calculamos los minutos y los segundos restantes
    const minutes = Math.floor(roundedSeconds / 60);
    const remainingSeconds = roundedSeconds % 60;

    // Aseguramos que los segundos tengan siempre dos dígitos
    const formattedSeconds = remainingSeconds < 10 ? `0${remainingSeconds}` : remainingSeconds;

    return `${minutes}:${formattedSeconds}`;
}