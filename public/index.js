import { registerCodeViewerComponent } from "./components/code-viewer.js";

const app = () => {
    registerCodeViewerComponent();
}

document.addEventListener('DOMContentLoaded', app);
