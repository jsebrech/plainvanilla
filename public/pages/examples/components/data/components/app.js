class SantasApp extends HTMLElement {
    #theList = [/* { name, nice } */];

    connectedCallback() {
        this.innerHTML = `
            <h1>Santa's List</h1>
            <santas-form></santas-form>
            <santas-list></santas-list>
            <santas-summary></santas-summary>
        `;
        this.querySelector('santas-form')
            .addEventListener('add', (e) => {
                if (!e.detail.form.name) return;
                this.#theList.push(e.detail.form);
                this.update();
            });
        this.update();
    }

    update() {
        this.querySelector('santas-list').list = this.#theList.slice();
        this.querySelector('santas-summary').update(this.#theList.slice());
    }
}

export const registerApp = 
    () => customElements.define('santas-app', SantasApp);
