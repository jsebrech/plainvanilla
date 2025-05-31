import { html } from '../../lib/html.js';

class BlogHeader extends HTMLElement {
    connectedCallback() {
        this.role = 'banner';
        const title = this.getAttribute('title') || 'Plain Vanilla Blog';
        const published = this.getAttribute('published');
        const updated = this.getAttribute('updated');
        const template = document.createElement('template');
        template.innerHTML = html`
            <h1>${title}</h1>
            <p>A blog about vanilla web development &mdash; no frameworks, just standards.</p>
            <nav aria-label="breadcrumb">
                <ol>
                    <li><a href="${import.meta.resolve('../../index.html')}">Plain Vanilla</a></li>
                    <li><a href="${import.meta.resolve('../index.html')}">Blog</a></li>
                    <li><a href="#" aria-current="page">
                        <time datetime="${published}">
                            ${new Date(published).toLocaleDateString('en-US', { dateStyle: 'long' })}
                        </time>
                    </a></li>
                </ol>
                ${updated ? html`
                    <small>
                        Last updated:
                        <time datetime="${updated}">
                            ${new Date(updated).toLocaleDateString('en-US', { dateStyle: 'long' })}
                        </time>
                    </small>
                ` : ''}
            </nav>
        `;
        this.insertBefore(template.content, this.firstChild);
    }
}

export const registerBlogHeader = () => customElements.define('blog-header', BlogHeader);
