import React, { useState, useEffect } from 'react';
import './styles/CreareTask.css';

const CreareTask = ({ tasks, setTasks }) => {
    const [taskDescriere, setTaskDescriere] = useState('');
    const [executanti, setExecutanti] = useState([]);
    const [executantSelectat, setExecutantSelectat] = useState('');
    const [esteManager, setEsteManager] = useState(false);
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {

        const fetchUtilizatorCurent = async () => {
            try {
                const raspuns = await fetch(`${API_URL}/utilizator`, {
                    method: 'GET',
                    credentials: 'include',
                });

                if (raspuns.ok) {
                    const data = await raspuns.json();
                    setEsteManager(data.rol === 'manager');
                } else {
                    console.error('Nu s-au putut obține informațiile utilizatorului.');
                }
            } catch (err) {
                console.error('Eroare la obținerea utilizatorului curent:', err);
            }
        };

        const fetchExecutanti = async () => {
            const raspuns = await fetch(`${API_URL}/executanti`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const data = await raspuns.json();
                setExecutanti(data);
            } else {
                console.error('Nu am putut incarca executantii.');
            }
        };

        fetchUtilizatorCurent();
        fetchExecutanti();
    }, []);

    const creareTask = async () => {
        const raspuns = await fetch(`${API_URL}/task`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                descriere: taskDescriere,
                executantId: executantSelectat || null,
            }),
            credentials: 'include',
        });
    
        if (raspuns.ok) {
            const taskNou = await raspuns.json();
            const stareTask = executantSelectat ? 'PENDING' : 'OPEN'; 
            alert('Task creat cu succes!');
            setTasks([...tasks, { id: taskNou.taskId, descriere: taskDescriere, stare: stareTask }]);
            setTaskDescriere('');
            setExecutantSelectat('');
        } else {
            console.error('Nu am putut crea taskul.');
        }
    };    

    if (!esteManager) {
        return;
    }

    return (
        <div>
            <h2>Creare Task</h2>
            <div className="creare-task">
                <form onSubmit={(e) => {
                    e.preventDefault();
                    creareTask();
                    }}>
                    <input
                        type="text"
                        value={taskDescriere}
                        onChange={(e) => setTaskDescriere(e.target.value)}
                        placeholder="Descriere task"
                        name="descriere"
                        required
                    />
                    <select
                        value={executantSelectat}
                        onChange={(e) => setExecutantSelectat(e.target.value)}
                        name="executant"
                    >
                        <option value="">Selectează executant (stare: OPEN)</option>
                        {executanti.map((executant) => (
                            <option key={executant.id} value={executant.id}>
                                {executant.nume}
                            </option>
                        ))}
                    </select>
                    <button type="submit">Creează Task</button>
                </form>   
            </div>
        </div>
    );    
};

export default CreareTask;
