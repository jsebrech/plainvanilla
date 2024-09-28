import './App.js';
import './AddTask.js';
import './TaskList.js';
import './TasksContext.js';

const render = () => {
    const root = document.getElementById('root');
    root.append(document.createElement('tasks-app'));
}

document.addEventListener('DOMContentLoaded', render);
