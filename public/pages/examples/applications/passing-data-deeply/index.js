import { registerThemeContext } from './components/theme-context.js';
import { registerPanelComponent } from './components/panel.js';
import { registerButtonComponent } from './components/button.js';

const app = () => {
    registerThemeContext();
    registerPanelComponent();
    registerButtonComponent();
}

document.addEventListener('DOMContentLoaded', app);
