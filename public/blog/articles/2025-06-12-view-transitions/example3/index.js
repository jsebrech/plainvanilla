import { startTransition } from './view-transition.js';

export function transition() {
    startTransition(() => {
        document.getElementById('square1').classList.toggle('toggled');
        document.getElementById('square2').classList.toggle('toggled');
    });
}
