import React, { useState, useEffect } from 'react';
import './styles/ModificaTask.css';

const ModificaTask = () => {
    const [rolUtilizator, setRolUtilizator] = useState(null);
    const [taskuri, setTaskuri] = useState([]);
    const [executanti, setExecutanti] = useState([]);
    const [taskSelectat, setTaskSelectat] = useState('');
    const [executantSelectat, setExecutantSelectat] = useState('');
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchRolUtilizator = async () => {
            const raspuns = await fetch(`${API_URL}/utilizator`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const date = await raspuns.json();
                setRolUtilizator(date.rol);
            } else {
                console.error('Nu s-a putut obține rolul utilizatorului.');
            }
        };

        const fetchTaskuri = async () => {
            const raspuns = await fetch(`${API_URL}/task`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const date = await raspuns.json();
                setTaskuri(date);
            } else {
                console.error('Nu s-au putut obține taskurile.');
            }
        };

        const fetchExecutanti = async () => {
            const raspuns = await fetch(`${API_URL}/executanti`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const date = await raspuns.json();
                setExecutanti(date);
            } else {
                console.error('Nu s-au putut obține executanții.');
            }
        };

        fetchRolUtilizator();
        fetchTaskuri();
        fetchExecutanti();
    }, []);

    const actualizareExecutant = async () => {
        const raspuns = await fetch(`${API_URL}/task/${taskSelectat}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ alocat_la: executantSelectat }),
            credentials: 'include',
        });

        if (raspuns.ok) {
            alert('Executant actualizat cu succes!');
        } else {
            console.error('Nu s-a putut actualiza executantul.');
        }
    };

    const stergeTask = async () => {
        const raspuns = await fetch(`${API_URL}/task/${taskSelectat}`, {
            method: 'DELETE',
            credentials: 'include',
        });

        if (raspuns.ok) {
            alert('Task șters cu succes!');
        } else {
            console.error('Nu s-a putut șterge taskul.');
        }
    };

    if (rolUtilizator !== 'manager') {
        return null;
    }

    return (
        <div>
            <h2>Actualizare Task</h2>
            <div className="actualizare-task">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    actualizareExecutant();
                    }}>
                    <label htmlFor="select-task">Selectează un task: </label>
                    <select
                        id="select-task"
                        value={taskSelectat}
                        onChange={(e) => setTaskSelectat(e.target.value)}
                        required
                    >
                        <option value="">Alege un task</option>
                        {taskuri.map((task) => (
                            <option key={task.id} value={task.id}>
                                {task.descriere}
                            </option>
                        ))}
                    </select>
    
                    <label htmlFor="select-executant">Selectează un executant: </label>
                    <select
                        id="select-executant"
                        value={executantSelectat}
                        onChange={(e) => setExecutantSelectat(e.target.value)}
                        required
                    >
                        <option value="">Alege un executant</option>
                        {executanti.map((executant) => (
                            <option key={executant.id} value={executant.id}>
                                {executant.nume}
                            </option>
                        ))}
                    </select>
    
                    <button type="submit">Actualizează Executant</button>
                    <button onClick={stergeTask}>Șterge Task</button>
                </form>
            </div>
        </div>
    );    
};

export default ModificaTask;
