'use client';

import { useState } from "react"

export default function SearchBar() {

    const [formValue, setFormValue] = useState('')

    const handleInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        setFormValue(event.target.value);
    };

    const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
        event.preventDefault(); // Evitar que la página se recargue
        // Aquí puedes hacer algo con el valor del input, como enviarlo a una API
        console.log(formValue);
        setFormValue(''); // Limpiar el input después de la sumisión
    };

    return (
        <div>
            <form onSubmit={handleSubmit} className="flex flex-col space-y-4">
                <input
                    type="text"
                    value={formValue}
                    onChange={handleInputChange}
                    placeholder="Buscar contenido..."
                    className="border border-gray-300 rounded p-2"
                />
                {/* <button type="submit" className="bg-blue-500 text-white rounded p-2">
                    Enviar
                </button> */}
            </form>
        </div>
    )
}