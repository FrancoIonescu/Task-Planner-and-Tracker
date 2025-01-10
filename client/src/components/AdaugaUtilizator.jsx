import React, { useState, useEffect } from 'react';
import './styles/AdaugaUtilizator.css';

const AdaugaUtilizator = () => {
    const [rolUser, setRolUtilizator] = useState(null);
    const [rol, setRol] = useState('manager');
    const [manageri, setManageri] = useState([]); 
    const [managerSelectat, setManagerSelectat] = useState(''); 
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchRolUtilizator = async () => {
            const raspuns = await fetch(`${API_URL}/utilizator`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const data = await raspuns.json();
                setRolUtilizator(data.rol);
            }
        };

        const fetchManageri = async () => {
            const raspuns = await fetch(`${API_URL}/manageri`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const data = await raspuns.json();
                setManageri(data); 
            } else {
                console.error('Eroare la obținerea managerilor.');
            }
        };

        fetchRolUtilizator();
        fetchManageri();
    }, []);

    const gestionareSchimbareRol = (event) => {
        setRol(event.target.value);
    };

    const gestionareFormular = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);

        const utilizator = {
            nume: formData.get('nume'),
            parola: formData.get('parola'),
            email: formData.get('email'),
            rol: formData.get('rol'),
            manager_id: rol === 'executant' ? formData.get('id_manager') : null,
        };

        fetch(`${API_URL}/utilizator`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify(utilizator),
            credentials: 'include',
        })
            .then((raspuns) => {
                if (raspuns.ok) {
                    alert('Utilizator adăugat cu succes!');
                } else {
                    alert('Eroare la adăugarea utilizatorului.');
                }
            })
            .catch((error) => console.error('Eroare:', error));
    };

    if (rolUser !== 'admin') {
        return;
    }

    return (
        <div>
            <h2>Adaugă utilizator</h2>
            <div className='adaugare-utilizator'>
                <form onSubmit={gestionareFormular}>
                    <label>
                        Nume:
                        <input type="text" name="nume" required />
                    </label>
                    <label>
                        Parolă:
                        <input type="password" name="parola" required />
                    </label>
                    <label>
                        Email:
                        <input type="email" name="email" required />
                    </label>
                    <label>
                        Rol:
                        <select name="rol" value={rol} onChange={gestionareSchimbareRol} required>
                            <option value="manager">Manager</option>
                            <option value="executant">Executant</option>
                        </select>
                    </label>
                    {rol === 'executant' && (
                        <label>
                            Manager:
                            <select
                                name="id_manager"
                                value={managerSelectat}
                                onChange={(e) => setManagerSelectat(e.target.value)}
                                required
                            >
                                <option value="">Selectează un manager</option>
                                {manageri.map((manager) => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.nume}
                                    </option>
                                ))}
                            </select>
                        </label>
                    )}
                    <button type="submit">Adaugă</button>
                </form>
            </div>
        </div>
    );
};

export default AdaugaUtilizator;
