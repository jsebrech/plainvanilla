customElements.define('task-add', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <input type="text" placeholder="Add task" />
            <button>Add</button>
        `;
        this.querySelector('button').onclick = () => {
            const input = this.querySelector('input');
            this.closest('tasks-context').dispatch({
                type: 'added',
                id: nextId++,
                text: input.value
            });
            input.value = '';
        };
    }
})

let nextId = 3;
