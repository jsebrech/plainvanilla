import { startTransition } from './view-transition.js';

let currentRoute = '';

export function navigate() {
    currentRoute = currentRoute === 'route2' ? 'route1' : 'route2';
    updateRoute1();
    updateRoute2();
}

function updateRoute1() {
    startTransition(() => {
        if (currentRoute === 'route1') {
            document.getElementById('route1').classList.add('active');
        } else {
            document.getElementById('route1').classList.remove('active');
        }
    });
}

function updateRoute2() {
    startTransition(() => {
        const route2 = document.getElementById('route2');
        if (currentRoute === 'route2') {
            route2.classList.add('active', 'loading');
            route2.textContent = '...';
            load().then((data) => startTransition(() => {
                route2.textContent = data;
                route2.classList.remove('loading');
            }));
        } else {
            document.getElementById('route2').classList.remove('active');
        }
    });
}

function load() {
    return new Promise((resolve) => {
        setTimeout(() => {
            resolve('Hi!');
        }, 250);
    });
}
