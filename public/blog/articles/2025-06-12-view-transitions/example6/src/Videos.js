import { startTransition } from '../lib/view-transition.js';
import { PlayIcon, PauseIcon } from './Icons.js';
import './LikeButton.js';

customElements.define('demo-video', class extends HTMLElement {
    update(video) {
        this.innerHTML = `
            <div class="video">
                <a class="link" href="/video/${video.id}">
                    <div
                        aria-hidden="true"
                        tabIndex="-1"
                        style="view-transition-name: video-${video.id}"
                        class="thumbnail ${video.image}">
                    </div>

                    <div class="info">
                        <div class="video-title">${video.title}</div>
                        <div class="video-description">${video.description}</div>
                    </div>
                </a>
                <demo-video-like id="${video.id}"></demo-video-like>
            </div>
        `;
    }
});

customElements.define('demo-video-controls', class extends HTMLElement {
    isPlaying = false;
    connectedCallback() {
        this.innerHTML = `
            <span class="controls">
                ${PlayIcon()}
            </span>
        `;
        this.addEventListener('click', this);
        this.update();
    }
    handleEvent(e) {
        startTransition(async () => {
            this.isPlaying = !this.isPlaying;
            this.update();
        });
    }
    update() {
        this.querySelector('span').innerHTML = this.isPlaying ? PauseIcon() : PlayIcon();
    }
});
