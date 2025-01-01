import { html } from '../../lib/html.js';

class BlogArchive extends HTMLElement {
    connectedCallback() {
        this.textContent = 'Loading...';
        fetch(import.meta.resolve('../articles/index.json'))
            .then(response => response.json())
            .then(articles => {
                // sort articles by published descending
                articles.sort((a, b) => {
                    return -a.published.localeCompare(b.published);
                });
                this.innerHTML = '<ul class="cards">' +
                    articles.map(item => html`
                        <li class="card">
                            <h3><a href="${import.meta.resolve(`../articles/${item.slug}/`)}">${item.title}</a></h3>
                            <p>${item.summary}</p>
                            <small>
                                <time datetime="${item.published}">
                                    ${new Date(item.published).toLocaleDateString('en-US', { dateStyle: 'long' })}
                                </time>
                            </small>
                        </li>
                    `).join('\n') +
                '</ul>';
            })
            .catch(e => { 
                this.textContent = e.message;
            });
    }
}

export const registerBlogArchive = 
    () => customElements.define('blog-archive', BlogArchive);
