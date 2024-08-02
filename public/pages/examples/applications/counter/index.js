import { registerCounterComponent } from './components/counter.js';

const app = () => {
    registerCounterComponent();
}

document.addEventListener('DOMContentLoaded', app);
