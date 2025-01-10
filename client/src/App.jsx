import React from 'react';
import Navbar from './components/Navbar';  
import ListaTaskuri from './components/ListaTaskuri';
import AdaugaUtilizator from './components/AdaugaUtilizator';
import CreareTask from './components/CreareTask';
import ModificaTask from './components/ModificaTask';

const App = () => {
    return (
        <div>
            <Navbar />
            <ListaTaskuri />
            <AdaugaUtilizator />
            <CreareTask />
            <ModificaTask />
        </div>
    );
};

export default App;
