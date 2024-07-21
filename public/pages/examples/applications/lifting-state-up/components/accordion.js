class Accordion extends HTMLElement {
    #activeIndex = 0;

    get activeIndex () { return this.#activeIndex; }
    set activeIndex(index) { this.#activeIndex = index; this.update(); }

    connectedCallback() {
        this.innerHTML = `
            <h2>Almaty, Kazakhstan</h2>
            <x-panel
                title="About">
                With a population of about 2 million, Almaty is Kazakhstan's largest city. From 1929 to 1997, it was its capital city.
            </x-panel>
            <x-panel
                title="Etymology">
                The name comes from <span lang="kk-KZ">алма</span>, the Kazakh word for "apple" and is often translated as "full of apples". In fact, the region surrounding Almaty is thought to be the ancestral home of the apple, and the wild <i lang="la">Malus sieversii</i> is considered a likely candidate for the ancestor of the modern domestic apple.
            </x-panel>
        `;
        this.querySelectorAll('x-panel').forEach((panel, index) => {
            panel.addEventListener('show', () => {
                this.activeIndex = index;
            });
        })
        this.update();
    }

    update() {
        this.querySelectorAll('x-panel').forEach((panel, index) => {
            panel.setAttribute('active', index === this.activeIndex);
        });
    }
}

export const registerAccordionComponent = () => {
    customElements.define('x-accordion', Accordion);
}
