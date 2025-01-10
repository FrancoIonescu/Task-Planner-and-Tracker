express = require('express');
const sequelize = require('./db');
const Utilizator = require('./utilizator');  
const Task = require('./task');
require('./asocieri');
const session = require('express-session'); 
const cors = require('cors');
require('dotenv').config();
const app = express();
const port = process.env.PORT;

app.use(express.json());
app.use(express.static(__dirname));
app.use(cors({
    origin: process.env.FRONTEND_URL, 
    credentials: true
}));

app.use(session({
    secret: process.env.SESSION_SECRET,  
    resave: false,         
    saveUninitialized: true,  
    cookie: { secure: false } 
}));

app.post('/conectare', async (req, res) => {
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
        req.session.rol = utilizator.rol;

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

app.get('/sesiune', (req, res) => {
    if (req.session.utilizatorId) {
        res.json({ nume: req.session.nume });
    } else {
        res.status(401).json({ message: 'Nu ești logat' });
    }
});

app.post('/deconectare', (req, res) => {
    req.session.destroy((err) => {
        if (err) {
            return res.status(500).json({ message: 'Eroare la deconectare' });
        }
        res.status(200).json({ message: 'Logout cu succes' });
    });
});

app.get('/utilizator', async (req, res) => {
    if (!req.session.utilizatorId) {
        return res.status(401).json({ message: 'Nu ești logat' });
    }

    try {
        const utilizator = await Utilizator.findByPk(req.session.utilizatorId, {
            attributes: ['id', 'nume', 'rol']
        });

        if (!utilizator) {
            return res.status(404).json({ message: 'Utilizatorul nu a fost găsit' });
        }

        res.json({
            id: utilizator.id,
            nume: utilizator.nume,
            rol: utilizator.rol
        });
    } catch (err) {
        console.error('Eroare la obținerea utilizatorului curent:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.post('/utilizator', async (req, res) => {
    const { nume, email, parola, rol, manager_id} = req.body;
     if (req.session.rol !== 'admin') { 
         return res.status(403).json({ message: 'Acces interzis. Doar administratorii pot crea utilizatori.' });
     }
    try {
        const utilizatorNou = await Utilizator.create({ nume, email, parola, rol, manager_id });
        res.status(201).json({ message: 'Utilizator creat cu succes', utilizator: utilizatorNou });
    } catch (err) {
        console.error('Eroare la crearea utilizatorului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.get('/task', async (req, res) => {
    if (!req.session.utilizatorId) {
        return res.status(401).json({ message: 'Nu ești logat sau nu ai permisiuni.' });
    }

    try {
        const { executantSelectat } = req.query;
        const executant = req.session.rol === 'executant';
        const utilizatorId = req.session.utilizatorId;
        let taskuri;

        if (executant) {
            taskuri = await Task.findAll({
                where: { alocat_la: utilizatorId },
                include: [
                    {
                        model: Utilizator,
                        as: 'creator',
                        attributes: ['nume'] 
                    },
                    {
                        model: Utilizator,
                        as: 'executant',
                        attributes: ['nume'] 
                    }
                ]
            });
        } else if (executantSelectat) {
            taskuri = await Task.findAll({
                where: { alocat_la: executantSelectat },
                include: [
                    {
                        model: Utilizator,
                        as: 'creator',
                        attributes: ['nume'] 
                    },
                    {
                        model: Utilizator,
                        as: 'executant',
                        attributes: ['nume']
                    }
                ]
            });
        } else {
            taskuri = await Task.findAll({
                include: [
                    {
                        model: Utilizator,
                        as: 'creator',
                        attributes: ['nume'] 
                    },
                    {
                        model: Utilizator,
                        as: 'executant',
                        attributes: ['nume'] 
                    }
                ]
            });
        }

        res.json(taskuri);
    } catch (err) {
        console.error('Eroare la obținerea taskurilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.post('/task', async (req, res) => {
    const { descriere, executantId } = req.body;

    if (!req.session.utilizatorId || req.session.rol !== 'manager') {
        return res.status(403).json({ message: 'Acces interzis. Doar managerii pot crea task-uri.' });
    }

    try {
        const stareInitiala = executantId ? 'PENDING' : 'OPEN';

        const taskNou = await Task.create({
            descriere,
            creat_de: req.session.utilizatorId,
            alocat_la: executantId || null, 
            stare: stareInitiala,
        });

        res.status(201).json({ message: 'Task creat cu succes', taskId: taskNou.id });
    } catch (err) {
        console.error('Eroare la crearea task-ului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.put('/task/:taskId', async (req, res) => {
    const { taskId } = req.params;
    const { alocat_la, stareNoua } = req.body;

    try {
        let task = await Task.findOne({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: 'Taskul nu a fost găsit' });
        }

        if (req.session.rol !== 'manager' && task.alocat_la !== req.session.utilizatorId) {
            return res.status(403).json({ message: 'Nu ai permisiunea de a modifica acest task' });
        }

        if (alocat_la) {
            task.alocat_la = alocat_la;  
        }

        if (stareNoua) {
            task.stare = stareNoua;
            if (stareNoua === 'COMPLETED' || stareNoua === 'CLOSED') {
                task.finalizat_la = new Date();
            } else {
                task.finalizat_la = null;
            }
        }

        await task.save();

        res.json({ message: 'Task-ul a fost actualizat' });
    } catch (err) {
        console.error('Eroare la actualizarea task-ului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.delete('/task/:taskId', async (req, res) => {
    const { taskId } = req.params;

    try {
        const task = await Task.findOne({ where: { id: taskId } });

        if (!task) {
            return res.status(404).json({ message: 'Taskul nu a fost găsit' });
        }

        if (req.session.rol !== 'manager' && task.alocat_la !== req.session.utilizatorId) {
            return res.status(403).json({ message: 'Nu ai permisiunea de a șterge acest task' });
        }

        await task.destroy(); 

        res.json({ message: 'Task-ul a fost șters cu succes' });
    } catch (err) {
        console.error('Eroare la ștergerea task-ului:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.get('/executanti', async (req, res) => {
    if (req.session.rol !== 'manager' && req.session.rol !== 'admin') {
        return res.status(403).json({ message: 'Acces interzis. Doar managerii pot vizualiza executanții.' });
    }

    try {
        const executanti = await Utilizator.findAll({
            where: { rol: 'executant' },
            attributes: ['id', 'nume']
        });

        res.json(executanti);
    } catch (err) {
        console.error('Eroare la obținerea executanților:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.get('/manageri', async (req, res) => {
    if (!req.session.utilizatorId || req.session.rol !== 'admin') {
        return res.status(403).json({ message: 'Acces interzis. Doar administratorul poate vizualiza managerii.' });
    }

    try {
        const manageri = await Utilizator.findAll({
            where: { rol: 'manager' },
            attributes: ['id', 'nume']
        });

        res.json(manageri);
    } catch (err) {
        console.error('Eroare la obținerea managerilor:', err);
        res.status(500).json({ message: 'Eroare la server' });
    }
});

app.listen(port, async () => {
    try {
        await sequelize.sync();
        console.log(`Serverul este pornit pe http://localhost:${port}`);
    } catch (err) {
        console.error('Eroare la sincronizarea bazei de date:', err);
    }
});