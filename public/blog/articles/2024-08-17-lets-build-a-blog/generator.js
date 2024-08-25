customElements.define('blog-generator', class BlogGenerator extends HTMLElement {

    // ...

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

        this.#articles.push({
            slug, title, summary, content, published, updated, image
        });
    }

    async processArticleContent(main, path) {
        // inline code examples
        await Promise.all([...main.querySelectorAll('x-code-viewer')].map(async (elem) => {
            const text = await this.downloadFile(elem.getAttribute('src'), path);
            const pre = document.createElement('pre');
            pre.innerHTML = html`<code>${text}</code>`;
            elem.replaceWith(pre);
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

    // ...

});