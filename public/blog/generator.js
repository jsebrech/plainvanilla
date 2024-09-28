import { html } from '../lib/html.js';

const BLOG_BASE_URL = 'https://plainvanillaweb.com/blog/';

const ATOM_FEED_XML = `<?xml version="1.0" encoding="UTF-8"?>
<feed xmlns="http://www.w3.org/2005/Atom" xmlns:media="http://search.yahoo.com/mrss/">
    <title>Plain Vanilla Blog</title>
    <id>https://plainvanillaweb.com/blog/</id>
    <icon>https://plainvanillaweb.com/favicon.ico</icon>
    <logo>https://plainvanillaweb.com/android-chrome-512x512.png</logo>
    <link rel="alternate" href="https://plainvanillaweb.com/blog/"/>
    <link rel="self" href="https://plainvanillaweb.com/blog/feed.xml"/>
    <updated>%UPDATED%</updated>
    <author>
        <name>Joeri Sebrechts</name>
    </author>
%ENTRIES%
</feed>`;

const ATOM_FEED_LENGTH = 20;

customElements.define('blog-generator', class BlogGenerator extends HTMLElement {

    #blogFolder;
    #articles; // [{ slug, title, summary, content, published, image: { src, alt } }]

    reset() {
        this.#blogFolder = null;
        this.#articles = [];
        this.textContent = 'To start: drag the blog folder here, or click to open it with a picker.';
    }

    showError(text) {
        this.textContent = '';
        this.addMessage(text, 'warning');
    }

    connectedCallback() {
        this.reset();
        this.addDragListeners();
        this.addClickListener();
    }

    addClickListener() {
        this.addEventListener('click', () => {
            if (this.#blogFolder) return;
            if (!window.showDirectoryPicker) {
                this.showError('Opening folders with a picker is not supported in your browser.');
            } else {
                window.showDirectoryPicker({ 
                    id: 'plain-vanilla-generator', 
                    mode: 'read',
                    startIn: 'documents'
                }).then(async (entry) => {
                    await this.startProcessing(entry);
                }).catch((e) => {
                    this.showError(e.message);
                });
            }
        });
    }

    addDragListeners() {
        this.addEventListener('dragover', (e) => {
            // Prevent navigation.
            e.preventDefault();
        });

        this.addEventListener('drop', async (e) => {
            try {
                // Prevent navigation.
                e.preventDefault();
                // Process all of the items.
                const item = e.dataTransfer.items[0];
                // Careful: `kind` will be 'file' for both file _and_ directory entries.
                if (item.kind === 'file') {
                    if (!item.getAsFileSystemHandle) {
                        throw new Error('Dropping files is not supported in your browser.');
                    }
                    await this.startProcessing(item.getAsFileSystemHandle());
                }
            } catch (e) {
                this.showError(e.message);
            }
        });
    }

    async startProcessing(blogFolder) {
        this.#blogFolder = await blogFolder;
        if (this.#blogFolder.kind !== 'directory' || this.#blogFolder.name !== 'blog') {
            this.#blogFolder = null;
            throw new Error('That folder is not the blog directory.');
        }

        this.#articles = [];
        this.innerHTML = '';
        this.addMessage('Processing...');
        const articlesFolder = await this.#blogFolder.getDirectoryHandle('articles');
        for await (const [key, value] of articlesFolder.entries()) {
            if (value.kind === 'directory') {
                this.addMessage(`Parsing ${key}/`);
                try {
                    const article = await value.getFileHandle('index.html');
                    await this.processArticle(article, value);
                } catch (e) {
                    if (e.name === 'NotFoundError') {
                        this.addMessage(`Folder ${key}/ does not have an index.html file, skipping.`, 'warning');
                        continue;
                    }
                    throw new Error('Error processing ' + value.name + ': ' + e.message);
                }
            }
        }
        
        // sort articles by published descending
        this.#articles.sort((a, b) => {
            return -a.published.localeCompare(b.published);
        });

        this.addFeedBlock();
        this.addIndexJsonBlock();
    }

    async processArticle(article, path) {
        const file = await article.getFile();
        const html = await file.text();
        const dom = (new DOMParser()).parseFromString(html, 'text/html');
        // mandatory
        const title = dom.querySelector('title').textContent;
        const summary = dom.querySelector('meta[name="description"]').getAttribute('content');
        const published = dom.querySelector('blog-header').getAttribute('published');
        const content = await this.processArticleContent(dom.querySelector('main'), path);
        const slug = path.name;
        // optional
        const img = dom.querySelector('blog-header img');
        const image = img && { src: img.getAttribute('src'), alt: img.getAttribute('alt') };
        const updated = dom.querySelector('blog-header').getAttribute('updated') || undefined;
        const author = dom.querySelector('blog-header p[aria-label="author"]').textContent || undefined;

        this.#articles.push({
            slug, title, summary, content, published, updated, image, author
        });
    }

    async processArticleContent(main, path) {
        // inline code examples
        await Promise.all([...main.querySelectorAll('x-code-viewer')].map(async (elem) => {
            const text = await this.downloadFile(elem.getAttribute('src'), path);
            const div = document.createElement('div');
            const name = elem.getAttribute('name');
            const label = name ? html`<p><em>${name}:</em></p>` : '';
            div.innerHTML = html`${label}<pre><code>${text}</code></pre>`;
            elem.replaceWith(div);
        }));

        // convert img src to absolute url
        [...main.querySelectorAll('img')].map((elem) => {
            const src = elem.getAttribute('src');
            if (src.indexOf('http') !== 0) {
                elem.setAttribute('src', new URL(`articles/${path.name}/${src}`, BLOG_BASE_URL));
            }
        });

        // replace iframes by links
        [...main.querySelectorAll('iframe')].map((elem) => {
            const src = elem.getAttribute('src');
            const title = elem.getAttribute('title') || src;
            const a = document.createElement('a');
            a.textContent = title;
            const p = document.createElement('p');
            p.appendChild(a);
            elem.replaceWith(p);
            if (src.indexOf('http') !== 0) {
                a.href = new URL(`articles/${path.name}/${src}`, BLOG_BASE_URL);
            } else {
                a.href = src;
            }
        });

        return main.innerHTML;
    }

    async downloadFile(file, path) {
        const parts = await this.#blogFolder.resolve(path);
        parts.push(file);
        const url = new URL(parts.join('/'), import.meta.url);
        return fetch(url).then(res => res.text());
    }

    addMessage(text, className) {
        const message = document.createElement('p');
        message.textContent = text;
        message.className = className;
        this.appendChild(message);
    }

    addFeedBlock() {
        const lastUpdated = this.#articles.map(a => a.updated || a.published).sort().pop();
        const xml = ATOM_FEED_XML
            .replace('%UPDATED%', toISODate(lastUpdated))
            .replace('%ENTRIES%', this.#articles.slice(0, ATOM_FEED_LENGTH).map(a => {
                const url = `${BLOG_BASE_URL}articles/${a.slug}/`;
                const media = a.image ? `<media:content url="${new URL(a.image.src, url)}" type="image/${a.image.src.split('.').pop()}" medium="image" />` : '';
                const author = a.author ? `<author><name><![CDATA[${a.author}]]></name></author>` : '';
                return `    <entry>
        <title><![CDATA[${a.title}]]></title>
        <link rel="alternate" type="text/html" href="${url}"/>
        <id>${url}</id>
        <published>${toISODate(a.published)}</published>
        <updated>${toISODate(a.updated || a.published)}</updated>
        <summary><![CDATA[${a.summary}]]></summary>
        ${media}
        ${author}
        <content type="html"><![CDATA[${a.content}]]></content>
    </entry>`;
            }).join('\n'));

        this.addMessage('feed.xml:');
        const pre = document.createElement('pre');
        pre.textContent = xml;
        this.appendChild(pre);
        pre.scrollIntoView();
        const button = document.createElement('button');
        button.onclick = () => navigator.clipboard.writeText(xml);
        button.textContent = 'Copy feed.xml to clipboard';
        this.appendChild(button);
        this.addMessage(' ');
    }

    addIndexJsonBlock() {
        const text = JSON.stringify(this.#articles.map(obj => ({ 
            ...obj, 
            content: undefined,
            image: undefined
        })), null, 4);

        this.addMessage('articles/index.json:');
        const pre = document.createElement('pre');
        pre.textContent = text;
        this.appendChild(pre);
        pre.scrollIntoView();
        const button = document.createElement('button');
        button.onclick = () => navigator.clipboard.writeText(text);
        button.textContent = 'Copy index.json to clipboard';
        this.appendChild(button);
    }
});

function toISODate(date) {
    if (typeof date === 'string') {
        // default to publishing at noon UTC
        if (date.indexOf('T') === -1) {
            date = date + 'T12:00:00.000Z';
        }
        return new Date(date).toISOString();
    }
    return date;
}