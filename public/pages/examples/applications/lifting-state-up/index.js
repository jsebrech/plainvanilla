import { registerAccordionComponent } from './components/accordion.js';
import { registerPanelComponent } from './components/panel.js';

const app = () => {
    registerAccordionComponent();
    registerPanelComponent();
}

document.addEventListener('DOMContentLoaded', app);
