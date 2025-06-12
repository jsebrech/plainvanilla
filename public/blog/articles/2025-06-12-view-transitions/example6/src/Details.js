import { startTransition } from '../lib/view-transition.js';
import { html } from '../lib/html.js';
import { ChevronLeft } from './Icons.js';
import { fetchVideo, fetchVideoDetails } from './data.js';
import './Layout.js';

customElements.define('demo-details', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <view-route path="/video/(?<id>[\\w]+)">
                <demo-page>
                    <div slot="heading">
                        <a class="link fit back" href="/">
                            ${ChevronLeft()} Back
                        </a>
                    </div>
                    <div class="details">
                        <demo-video></demo-video>
                        <demo-video-details></demo-video-details>
                    </div>
                </demo-page>
            </view-route>
        `;
        const id = this.querySelector('view-route').matches?.groups?.id ?? null;
        this.update(id);
        this.addEventListener('routechange', this);
    }
    
    handleEvent(e) { 
        if (e.type === 'routechange') {
            this.update(e.detail?.groups?.id);
        }
    }

    update(id) {
        const videoElem = this.querySelector('demo-video');
        videoElem.innerHTML = '';
        if (id) {
            startTransition(() => fetchVideo(id).then(video => {
                videoElem.innerHTML = html`
                    <div
                        aria-hidden="true"
                        style="view-transition-name: video-${video.id}"
                        class="thumbnail ${video.image}">
                        <demo-video-controls></demo-video-controls>
                    </div>
                `;
            }));
            this.querySelector('demo-video-details').update(id);
        }
    }
});

customElements.define('demo-video-details', class extends HTMLElement {
    async update(id) {
        if (id) {
            const load = fetchVideoDetails(id);
            const wait = new Promise((resolve) => { setTimeout(resolve, 10, null); });
            let video = await Promise.race([load, wait]);
            if (video) {
                this.innerHTML = videoInfo(video);
            } else {
                this.innerHTML = videoInfoFallback();
                video = await load;
                // animate content in and fallback out
                startTransition(() => {
                    this.innerHTML = videoInfo(video);
                });
            }
        } else this.innerHTML = '';
    }
});

const videoInfoFallback = () => `
    <div style="view-transition-name: details-fallback">
        <div class="fallback title"></div>
        <div class="fallback description"></div>
    </div>
`;

const videoInfo = (details) => html`
    <div style="view-transition-name: details-content">
        <p class="info-title">${details.title}</p>
        <p class="info-description">${details.description}</p>
    </div>
`;