express = require('express');
const sequelize = require('./db');
const Utilizator = require('./utilizator');  
const session = require('express-session'); 
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = 5000;

app.use(express.json());
app.use(express.static(__dirname));
app.use(cors({
    origin: 'http://localhost:5173', 
    methods: ['GET', 'POST', 'PUT'],  
    credentials: true
  }));

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,         
    saveUninitialized: true,  
    cookie: { secure: false } 
}));

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

app.get('/check-session', (req, res) => {
    if (req.session.utilizatorId) {
        res.json({ nume: req.session.nume });
    } else {
        res.status(401).json({ message: 'Nu ești logat' });
    }
});

app.post('/logout', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Eroare la deconectare' });
        }
        res.status(200).json({ message: 'Logout cu succes' });
    });
});

app.get('/tasks', async (req, res) => {
    if (!req.session.utilizatorId) {
        return res.status(401).json({ message: 'Nu ești logat' });
    }

    try {
        const taskuri = await sequelize.query(
            'SELECT * FROM taskuri WHERE alocat_la = :utilizatorId', 
            {
                replacements: { utilizatorId: req.session.utilizatorId },
                type: sequelize.QueryTypes.SELECT
            }
        );
        res.json(taskuri);
    } catch (err) {
        console.error('Eroare la obținerea taskurilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.put('/tasks/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { newStatus } = req.body;

    try {
        const task = await sequelize.query(
            'UPDATE taskuri SET stare = :newStatus WHERE id = :taskId AND alocat_la = :utilizatorId',
            {
                replacements: { newStatus, taskId, utilizatorId: req.session.utilizatorId },
                type: sequelize.QueryTypes.UPDATE
            }
        );

        if (task[0] === 0) {
            return res.status(404).json({ message: 'Taskul nu a fost găsit sau nu îți este alocat' });
        }

        res.json({ message: 'Statusul taskului a fost actualizat' });
    } catch (err) {
        console.error('Eroare la actualizarea statusului taskului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.listen(port, () => {
    console.log(`Serverul este pornit pe http://localhost:${port}`);
});
