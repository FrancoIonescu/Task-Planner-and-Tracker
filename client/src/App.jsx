import React from 'react';
import Navbar from './components/Navbar';  
import TaskList from './components/TaskList';

const App = () => {
    return (
        <div>
            <Navbar />
            <TaskList />
        </div>
    );
};

export default App;
