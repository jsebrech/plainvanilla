import { registerAnalyticsComponent } from "./components/analytics/analytics.js";
import { registerCodeViewerComponent } from "./components/code-viewer/code-viewer.js";
import { registerTabPanelComponent } from "./components/tab-panel/tab-panel.js";

const app = () => {
    registerCodeViewerComponent();
    registerTabPanelComponent();
    registerAnalyticsComponent();
}

document.addEventListener('DOMContentLoaded', app);
