import { registerTabPanelComponent } from "../components/tab-panel/tab-panel.js";

const app = () => {
    registerTabPanelComponent();
    mocha.run();
}

document.addEventListener('DOMContentLoaded', app);
