import { html } from '../../lib/html.js';

class BlogFooter extends HTMLElement {
    connectedCallback() {
        const mastodonUrl = this.getAttribute('mastodon-url');
        this.innerHTML = html`
            <footer>                
                ${mastodonUrl ? 
                    html`<p style="text-align: center"><a href="${mastodonUrl}">Discuss on Mastodon</a></p>` : ''}
                <div class="contact">
                    <a href="https://sebrechts.net/">Contact</a>
                    <a href="https://github.com/jsebrech/plainvanilla">GitHub</a>
                </div>
                <p class="top-link">
                    <a href="#top">Back to top</a>
                </p>
                <x-analytics></x-analytics>
            </footer>
        `;
    }
}

export const registerBlogFooter = () => customElements.define('blog-footer', BlogFooter);
