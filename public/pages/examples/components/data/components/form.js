class SantasForm extends HTMLElement {
    connectedCallback() {
        if (this.querySelector('form')) return;
        this.innerHTML = `
            <form>
                <label for="name">Name</label>
                <input type="text" id="name" name="name" required />
                <input type="checkbox" id="nice" name="nice" value="1" />
                <label for="nice">Nice?</label>
                <button type="submit">Add</button>
            </form>
        `;
        this.querySelector('form').onsubmit = (e) => {
            e.preventDefault();
            const data = new FormData(e.target);
            this.dispatchEvent(new CustomEvent('add', {
                detail: { form: Object.fromEntries(data.entries()) }
            }));
            e.target.reset();
        }
    }
}

export const registerSantasForm = 
    () => customElements.define('santas-form', SantasForm);
