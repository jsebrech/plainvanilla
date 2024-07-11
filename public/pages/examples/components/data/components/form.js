class SantasForm extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <form>
                <label for="name">Name</label>
                <input type="text" name="name" />
                <label for="nice">Nice?</label>
                <input type="checkbox" name="nice" value="1" />
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
