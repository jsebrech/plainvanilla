import { routerEvents } from "../lib/view-route.js";
import { startTransition } from "../lib/view-transition.js";
import './Layout.js';
import './Videos.js';
import { IconSearch } from "./Icons.js";
import { fetchVideos } from "./data.js";

customElements.define('demo-home', class extends HTMLElement {
    videos = [];
    searchInput = null;
    searchList = null;

    connectedCallback() {
        this.innerHTML = `
            <demo-page>
                <div class="fit" slot="heading"></div>
                <demo-search-input></demo-search-input>
                <demo-search-list>Loading...</demo-search-list>
            </demo-page>
        `;
        this.searchInput = this.querySelector('demo-search-input');
        this.searchInput.addEventListener('change', this.update.bind(this));
        this.searchList = this.querySelector('demo-search-list');
        fetchVideos().then(videos => {
            this.videos = videos;
            this.querySelector('div[slot=heading]').textContent = `${videos.length} Videos`;
            this.update();
        });
        // rerender after back navigation
        routerEvents.addEventListener('popstate', this);
    }

    handleEvent(e) { this.update(); }

    update() {
        const filteredVideos = filterVideos(this.videos, this.searchInput.text);
        this.searchList.update(filteredVideos, this.searchInput.text);
    }
});

customElements.define('demo-search-input', class extends HTMLElement {
    #text = '';
    get text() { return this.#text }
    set text(v) { if (this.#text !== v) { this.#text = v; this.update(); } }

    connectedCallback() {
        this.innerHTML = `
            <form class="search">
                <label for="search" class="sr-only">
                    Search
                </label>
                <div class="search-input">
                    <div class="search-icon">
                        ${IconSearch()}
                    </div>
                    <input id="search" type="text" placeholder="Search" />
                </div>
            </form>
        `;
        this.querySelector('input').addEventListener('input', e => {
            this.#text = e.target.value;
            this.dispatchEvent(new CustomEvent('change', { detail: e.target.value }));
        });
        this.querySelector('form').addEventListener('submit', e => {
            e.preventDefault();
        });
        this.update();
    }
    update() {
        this.querySelector('input').value = this.text;
    }
});

customElements.define('demo-search-list', class extends HTMLElement {
    update(videos, text) {
        const filteredVideos = filterVideos(videos, text);
        startTransition(() => {
            this.innerHTML = `
                <div class="video-list">
                    <div class="videos"></div>
                    ${!filteredVideos.length ? (
                        `<div class="no-results">No results</div>`
                    ) : ''}
                </div>
            `;
            if (filteredVideos.length) {
                this.querySelector('.videos').replaceChildren(...filteredVideos.map(v => {
                    const transition = document.createElement('view-transition');
                    transition.name = `list-video-${v.id}`;
                    transition.append(document.createElement('demo-video'));
                    transition.firstChild.update(v);
                    return transition;
                }));
            }
        });
    }
});

function filterVideos(videos, query) {
  const keywords = query
    .toLowerCase()
    .split(" ")
    .filter((s) => s !== "");
  if (keywords.length === 0) {
    return videos;
  }
  return videos.filter((video) => {
    const words = (video.title + " " + video.description)
      .toLowerCase()
      .split(" ");
    return keywords.every((kw) => words.some((w) => w.includes(kw)));
  });
}
