import { Heart } from './Icons.js';

// A hack since we don't actually have a backend.
// Unlike local state, this survives videos being filtered.
const likedVideos = new Set();

customElements.define('demo-video-like', class extends HTMLElement {
    animate = false;
    connectedCallback() {
        this.replaceChildren(document.createElement('button'));
        this.update();
    };
    update() {
        const id = this.getAttribute('id');
        const liked = likedVideos.has(id);
        const button = this.querySelector('button');
        button.className = 'like-button ' + (liked ? 'liked' : '');
        button.ariaLabel = liked ? 'Unsave' : 'Save';
        button.innerHTML = Heart({liked, animate: this.animate});
        button.onclick = () => {
            this.animate = true;
            likedVideos[liked ? 'delete' : 'add'](id);
            this.update();
            this.animate = false;
        };
    }
});
