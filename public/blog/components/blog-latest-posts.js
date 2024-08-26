import { html } from '../../lib/html.js';

const pathify = (url) => url && new URL(url).pathname.replace('/blog/', './');

class LatestPosts extends HTMLElement {
    connectedCallback() {
        this.textContent = "Loading...";
        // show the most recent items from the RSS feed
        fetch(new URL('../feed.xml', import.meta.url))
            .then(response => response.text())
            .then(text => new DOMParser().parseFromString(text, "text/xml"))
            .then(data => {
                const parserError = data.querySelector('parsererror div');
                if (parserError) {
                    throw new Error(parserError.textContent);
                }
                // only the 6 most recent entries
                const feedItems = 
                    [...data.querySelectorAll('entry')].slice(0, 6)
                    .map(item => ({
                        title: item.querySelector('title')?.textContent,
                        link: pathify(item.querySelector('id')?.textContent),
                        published: item.querySelector('published')?.textContent,
                        updated: item.querySelector('updated')?.textContent,
                        summary: item.querySelector('summary')?.textContent,
                        image: pathify(item.querySelector('content')?.getAttribute('url'))
                    }))
                    // sanity check
                    .filter(item => item.link && item.title);
                if (feedItems.length) {
                    this.innerHTML = '<ul class="cards">' +
                        feedItems.map(item => html`
                            <li class="card">
                                ${item.image ? html`<img src="${item.image}" aria-hidden="true" loading="lazy" />` : ''}
                                <h3><a href="${item.link}">${item.title}</a></h3>
                                <p>${item.summary}</p>
                                <small>
                                    <time datetime="${item.published}">
                                        ${new Date(item.published).toLocaleDateString('en-US', { dateStyle: 'long' })}
                                    </time>
                                </small>
                            </li>
                        `).join('\n') +
                        '</ul>';
                } else {
                    this.innerHTML = 'Something went wrong...';
                }
            })
            .catch(e => this.textContent = e.message);
    }
}

export const registerBlogLatestPosts = () => customElements.define('blog-latest-posts', LatestPosts);
