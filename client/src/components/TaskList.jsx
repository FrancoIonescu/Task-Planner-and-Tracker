import React, { useState, useEffect } from 'react';
import './styles/TaskList.css';

const TaskList = () => {
    const [tasks, setTasks] = useState([]);
    const statusOptions = ['OPEN', 'PENDING', 'COMPLETED']; 

    useEffect(() => {
        const fetchTasks = async () => {
            const response = await fetch('http://localhost:5000/tasks', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setTasks(data);
            } else {
                console.error('Nu am putut încărca task-urile.');
            }
        };

        fetchTasks();
    }, []);

    const updateTaskStatus = async (taskId, newStatus) => {
        const response = await fetch(`http://localhost:5000/tasks/${taskId}`, {
            method: 'PUT', 
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ newStatus }),  
            credentials: 'include',
        });
    
        if (response.ok) {
            const updatedTasks = tasks.map(task =>
                task.id === taskId ? { ...task, stare: newStatus } : task
            );
            setTasks(updatedTasks);
        } else {
            console.error('Nu am putut actualiza statusul task-ului.');
        }
    };    

    return (
        <div>
            <h2>Taskuri atribuite</h2>
            <ul>
                {tasks.length > 0 ? (
                    tasks.map((task) => (
                        <li key={task.id}>
                            <strong>{task.descriere}</strong> - Stare:
                            <select
                                value={task.stare}
                                onChange={(e) => updateTaskStatus(task.id, e.target.value)}
                            >
                                {statusOptions.map((status) => (
                                    <option key={status} value={status}>
                                        {status}
                                    </option>
                                ))}
                            </select>
                        </li>
                    ))
                ) : (
                    <p>Nu ai niciun task atribuit.</p>
                )}
            </ul>
        </div>
    );
};

export default TaskList;
