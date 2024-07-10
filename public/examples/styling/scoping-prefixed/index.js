import { registerExampleComponent } from './components/example/example.js';
const app = () => {
    registerExampleComponent();
}
document.addEventListener('DOMContentLoaded', app);
