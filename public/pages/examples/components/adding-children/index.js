import { registerAvatarComponent } from './components/avatar.js';
import { registerBadgeComponent } from './components/badge.js';
const app = () => {
    registerAvatarComponent();
    registerBadgeComponent();
}
document.addEventListener('DOMContentLoaded', app);
