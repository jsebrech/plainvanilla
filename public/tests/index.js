import { registerTabPanelComponent } from "../components/tab-panel/tab-panel.js";

const app = () => {
    registerTabPanelComponent();
    // eslint-disable-next-line no-undef
    mocha.run();
}

document.addEventListener('DOMContentLoaded', app);
