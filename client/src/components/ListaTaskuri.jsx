import React, { useState, useEffect } from 'react';
import './styles/ListaTaskuri.css';

const ListaTaskuri = () => {
    const [taskuri, setTaskuri] = useState([]);
    const [executanti, setExecutanti] = useState([]);
    const [executantSelectat, setExecutantSelectat] = useState('');
    const optiuniStatus = ['OPEN', 'PENDING', 'COMPLETED', 'CLOSED'];
    const API_URL = import.meta.env.VITE_API_URL;

    useEffect(() => {
        const fetchTaskuri = async () => {
            const url = executantSelectat
                ? `${API_URL}/task?executantSelectat=${executantSelectat}`
                : `${API_URL}/task`;

            const raspuns = await fetch(url, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const data = await raspuns.json();
                setTaskuri(data);
            } else {
                console.error('Nu am putut încărca taskurile.');
            }
        };

        fetchTaskuri();
    }, [executantSelectat]);

    useEffect(() => {
        const fetchExecutanti = async () => {
            const raspuns = await fetch(`${API_URL}/executanti`, {
                method: 'GET',
                credentials: 'include',
            });

            if (raspuns.ok) {
                const data = await raspuns.json();
                setExecutanti(data);
            } else {
                console.error('Nu am putut încărca executanții.');
            }
        };

        fetchExecutanti();
    }, []);

    const actualizareStareTask = async (taskId, stareNoua) => {
        const raspuns = await fetch(`${API_URL}/task/${taskId}`, {
            method: 'PUT',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ stareNoua }),
            credentials: 'include',
        });

        if (raspuns.ok) {
            const taskuriActualizate = taskuri.map(task =>
                task.id === taskId ? { ...task, stare: stareNoua } : task
            );
            setTaskuri(taskuriActualizate);
        } else {
            console.error('Nu am putut actualiza statusul taskului.');
        }
    };

    const formatDate = (data) => {
        const date = new Date(data);
        return date.toLocaleString('ro-RO', {
            year: 'numeric',
            month: '2-digit',
            day: '2-digit',
            hour: '2-digit',
            minute: '2-digit',
        });
    };

    return (
        <div className="lista-taskuri">
            <h2>Taskuri</h2>
            {executanti.length > 0 && (
                <div>
                    <label htmlFor="executor">Filtrează după executant: </label>
                    <select
                        id="executor"
                        value={executantSelectat}
                        onChange={(e) => setExecutantSelectat(e.target.value)}
                    >
                        <option value="">Toți executanții</option>
                        {executanti.map((executant) => (
                            <option key={executant.id} value={executant.id}>
                                {executant.nume}
                            </option>
                        ))}
                    </select>
                </div>
            )}
            {taskuri.length > 0 ? (
                <table>
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Continut</th>
                            <th>Creat de</th>
                            <th>Alocat la</th>
                            <th>Creat la</th>
                            <th>Finalizat la</th>
                            <th>Stare</th>
                        </tr>
                    </thead>
                    <tbody>
                        {taskuri.map((task) => (
                            <tr key={task.id} className={task.stare.toLowerCase()}>
                                <td>{task.id}</td>
                                <td>{task.descriere}</td>
                                <td>{task.creator.nume}</td>
                                <td>{task.executant ? task.executant.nume : 'Nealocat'}</td>
                                <td>{formatDate(task.creat_la)}</td>
                                <td>{task.finalizat_la ? formatDate(task.finalizat_la) : 'Nefinalizat'}</td>
                                <td>
                                    <select
                                        value={task.stare}
                                        onChange={(e) => actualizareStareTask(task.id, e.target.value)}
                                    >
                                        {optiuniStatus.map((status) => (
                                            <option key={status} value={status}>
                                                {status}
                                            </option>
                                        ))}
                                    </select>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            ) : (
                <p>Nu există niciun task de afișat.</p>
            )}
        </div>
    );
};

export default ListaTaskuri;
