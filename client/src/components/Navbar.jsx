import React, { useState, useEffect } from 'react';
import './styles/Navbar.css';

const Navbar = () => {
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');

    useEffect(() => {
        const checkSession = async () => {
            const response = await fetch('http://localhost:5000/check-session', {
                method: 'GET',
                credentials: 'include',
            });
            if (response.ok) {
                setIsLoggedIn(true);
            }
        };
        checkSession();
    }, []);

    const handleLogin = async (e) => {
        e.preventDefault();

        const response = await fetch('http://localhost:5000/login', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ nume: username, parola: password }),
            credentials: 'include',
        });

        if (response.ok) {
            setIsLoggedIn(true);
            window.location.reload(); 
        } else {
            alert('Username sau parolă incorectă');
        }
    };

    const handleLogout = async () => {
        await fetch('http://localhost:5000/logout', {
            method: 'POST',
            credentials: 'include',
        });
        setIsLoggedIn(false);
        window.location.reload();
    };

    return (
        <nav>
            <div className="navbar">
                <h1>Task Planner and Tracker</h1>
                <div className="login-container">
                    {isLoggedIn ? (
                        <button onClick={handleLogout}>Logout</button>
                    ) : (
                        <form onSubmit={handleLogin}>
                            <input
                                type="text"
                                placeholder="Username"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                                required
                            />
                            <input
                                type="password"
                                placeholder="Password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                            />
                            <button type="submit">Login</button>
                        </form>
                    )}
                </div>
            </div>
        </nav>
    );
};

export default Navbar;
