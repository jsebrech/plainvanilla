customElements.define('tasks-app', class extends HTMLElement {
    connectedCallback() {
        this.innerHTML = `
            <tasks-context>
                <h1>Day off in Kyoto</h1>
                <task-add></task-add>
                <task-list></task-list>
            </tasks-context>
        `;
    }
});
