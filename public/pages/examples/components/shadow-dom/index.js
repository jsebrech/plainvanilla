import { registerAvatarComponent } from './components/avatar.js';
import { registerBadgeComponent } from './components/badge.js';
import { registerHeaderComponent } from './components/header.js';
const app = () => {
    registerAvatarComponent();
    registerBadgeComponent();
    registerHeaderComponent();
}
document.addEventListener('DOMContentLoaded', app);
