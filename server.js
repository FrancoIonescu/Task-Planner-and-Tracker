const express = require('express');
const sequelize = require('./db');
const Utilizator = require('./utilizator');  
const session = require('express-session'); 
require('dotenv').config();
const app = express();
const port = 3000;

app.use(express.json());
app.use(express.static(__dirname));

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,         
    saveUninitialized: true,  
    cookie: { secure: false } 
}));

app.get('/', (req, res) => {
    res.sendFile(__dirname + '/index.html'); 
});

app.post('/login', async (req, res) => {
    const { nume, parola } = req.body;

    try {
        const utilizator = await Utilizator.findOne({ where: { nume: nume } });

        if (!utilizator) {
            return res.status(401).json({ message: 'Username sau parolă incorectă' });
        }

        if (utilizator.parola !== parola) { 
            return res.status(401).json({ message: 'Username sau parolă incorectă' });
        }

        req.session.utilizatorId = utilizator.id;  
        req.session.nume = utilizator.nume;

        res.json({
            id: utilizator.id,
            nume: utilizator.nume,
            email: utilizator.email,
            rol: utilizator.rol
        });

    } catch (err) {
        console.error('Eroare la autentificare:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.listen(port, () => {
    console.log(`Serverul este pornit pe http://localhost:${port}`);
});
