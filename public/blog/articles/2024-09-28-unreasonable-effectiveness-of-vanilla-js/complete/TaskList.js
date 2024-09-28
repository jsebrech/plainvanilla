customElements.define('task-list', class extends HTMLElement {
    get context() { return this.closest('tasks-context'); }
    
    connectedCallback() {
        this.context.addEventListener('change', () => this.update());
        this.append(document.createElement('ul'));
        this.update();
    }

    update() {
        const ul = this.querySelector('ul');
        let before = ul.firstChild;
        this.context.tasks.forEach(task => {
            let li = ul.querySelector(`:scope > [data-key="${task.id}"]`);
            if (!li) {
                li = document.createElement('li');
                li.dataset.key = task.id;
                li.append(document.createElement('task-item'));
            }
            li.firstChild.task = task;
            // move to the right position in the list if not there yet
            if (li !== before) ul.insertBefore(li, before);
            before = li.nextSibling;
        });
        // remove unknown nodes
        while (before) {
            const remove = before;
            before = before.nextSibling;
            ul.removeChild(remove);
        }
    }
});

customElements.define('task-item', class extends HTMLElement {
    #isEditing = false;
    #task;
    set task(task) { this.#task = task; this.update(); }
    get context() { return this.closest('tasks-context'); }

    connectedCallback() {
        if (this.querySelector('label')) return;
        this.innerHTML = `
            <label>
                <input type="checkbox" />
                <input type="text" />
                <span></span>
                <button id="edit">Edit</button>
                <button id="save">Save</button>
                <button id="delete">Delete</button>
            </label>
        `;
        this.querySelector('input[type=checkbox]').onchange = e => {
            this.context.dispatch({
                type: 'changed',
                task: {
                    ...this.#task,
                    done: e.target.checked
                }
            });
        };
        this.querySelector('input[type=text]').onchange = e => {
            this.context.dispatch({
                type: 'changed',
                task: {
                    ...this.#task,
                    text: e.target.value
                }
            });
        };
        this.querySelector('button#edit').onclick = () => {
            this.#isEditing = true;
            this.update();
        };
        this.querySelector('button#save').onclick = () => {
            this.#isEditing = false;
            this.update();
        };
        this.querySelector('button#delete').onclick = () => {
            this.context.dispatch({
                type: 'deleted',
                id: this.#task.id
            });
        };
        this.context.addEventListener('change', () => this.update());
        this.update();
    }

    update() {
        if (this.isConnected && this.#task) {
            this.querySelector('input[type=checkbox]').checked = this.#task.done;
            const inputEdit = this.querySelector('input[type=text]');
            inputEdit.style.display = this.#isEditing ? 'inline' : 'none';
            inputEdit.value = this.#task.text;
            const span = this.querySelector('span');
            span.style.display = this.#isEditing ? 'none' : 'inline';
            span.textContent = this.#task.text;
            this.querySelector('button#edit').style.display = this.#isEditing ? 'none' : 'inline';
            this.querySelector('button#save').style.display = this.#isEditing ? 'inline' : 'none';
        }
    }
});
