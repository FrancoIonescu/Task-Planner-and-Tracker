import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';

const Navbar = () => {
    const [esteConectat, setEsteConectat] = useState(false);
    const [numeUtilizator, setNumeUtilizator] = useState('');
    const [parola, setParola] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const verificaSesiunea = async () => {
            const raspuns = await fetch(`${API_URL}/sesiune`, {
                method: 'GET',
                credentials: 'include',
            });
            if (raspuns.ok) {
                const date = await raspuns.json();
                setEsteConectat(true);
                setNumeUtilizator(date.nume)
            }
        };
        verificaSesiunea();
    }, []);

    const gestioneazaConectare = async (e) => {
        e.preventDefault();

        const raspuns = await fetch(`${API_URL}/conectare`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nume: numeUtilizator, parola: parola }),
            credentials: 'include',
        });

        if (raspuns.ok) {
            setEsteConectat(true);
            window.location.reload(); 
        } else {
            alert('Nume utilizator sau parolă incorectă');
        }
    };

    const gestioneazaDeconectare = async () => {
        await fetch(`${API_URL}/deconectare`, {
            method: 'POST',
            credentials: 'include',
        });
        setEsteConectat(false);
        window.location.reload();
    };

    return (
        <nav>
            <div className="navbar">
                <h1>Task Planner and Tracker</h1>
                {esteConectat && <p>Bun venit, {numeUtilizator}!</p>}
                <div className="login-container">
                    {esteConectat ? (
                        <button onClick={gestioneazaDeconectare}>Deconectare</button>
                    ) : (
                        <form onSubmit={gestioneazaConectare}>
                            <input
                                type="text"
                                placeholder="Nume utilizator"
                                value={numeUtilizator}
                                onChange={(e) => setNumeUtilizator(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Parolă"
                                value={parola}
                                onChange={(e) => setParola(e.target.value)}
                                required
                            />
                            <button type="submit">Conectare</button>
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
