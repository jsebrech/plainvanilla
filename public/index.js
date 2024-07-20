import { registerCodeViewerComponent } from "./components/code-viewer/code-viewer.js";
import { registerTabPanelComponent } from "./components/tab-panel/tab-panel.js";

const app = () => {
    registerCodeViewerComponent();
    registerTabPanelComponent();
}

document.addEventListener('DOMContentLoaded', app);
