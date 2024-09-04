import { registerCodeViewerComponent } from "./components/code-viewer/code-viewer.js";
import { registerTabPanelComponent } from "./components/tab-panel/tab-panel.js";

const app = async () => {
    registerCodeViewerComponent();
    registerTabPanelComponent();
    const { registerAnalyticsComponent } = await import("./components/analytics/analytics.js");
    registerAnalyticsComponent();
}

document.addEventListener('DOMContentLoaded', app);
