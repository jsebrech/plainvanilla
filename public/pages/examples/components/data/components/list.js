class SantasList extends HTMLElement {
    #currentList = [/* { name, nice } */];
    set list(newList) {
        this.#currentList = newList;
        this.update();
    }
    update() {
        this.innerHTML = '<ul>' +
            this.#currentList.map((item) => `<li>${item.name} is ${item.nice ? 'nice' : 'naughty'}</li>`).join('\n') +
            '</ul>';
    }
}

export const registerSantasList =
    () => customElements.define('santas-list', SantasList);
