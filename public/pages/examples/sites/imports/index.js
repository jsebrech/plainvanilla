import { registerMetricsComponent } from './components/metrics.js';

const app = () => {
    registerMetricsComponent();
};

document.addEventListener('DOMContentLoaded', app);
