import { registerApp } from "./app/App.js";
import { registerRouteComponent } from "./components/route/route.js";

const app = () => {
    registerRouteComponent();
    registerApp();

    const template = document.querySelector('template#root');
    if (template) document.body.appendChild(template.content, true);
}

document.addEventListener('DOMContentLoaded', app);
