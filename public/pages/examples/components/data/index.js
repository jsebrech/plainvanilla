import { registerSantasForm } from './components/form.js';
import { registerSantasList } from './components/list.js';
import { registerSantasSummary } from './components/summary.js';
import { registerApp } from './components/app.js';

const app = () => {
    registerSantasForm();
    registerSantasList();
    registerSantasSummary();
    registerApp();
}

document.addEventListener('DOMContentLoaded', app);
