/**
 * Tabbed panel component
 * 
 * Usage:
 * <x-tab-panel>
 *     <x-tab title="Tab 1" active>
 *         <p>Tab 1 content</p> 
 *     </x-tab>
 *     <x-tab title="Tab 2">
 *         <p>Tab 2 content</p>
 *     </x-tab>
 * </x-tab-panel>
 * 
 * See: https://www.w3.org/WAI/ARIA/apg/patterns/tabs/
 */
class TabPanel extends HTMLElement {

    get tabList() { return this.shadowRoot.querySelector('div[role=tablist]'); }
    get slot() { return this.shadowRoot.querySelector('slot'); }

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
        this.shadowRoot.innerHTML = `
            <link rel="stylesheet" href="${new URL('tab-panel.css', import.meta.url)}">
            <div role="tablist"></div>
            <slot></slot>
        `;
    }

    connectedCallback() {
        // called when tabpanels are added
        this.slot.onslotchange = () => this.onSlotChange(); 
    }

    onSlotChange() {
        this.slot.assignedElements().forEach(tabPanel => {
            if (tabPanel.role !== 'tabpanel') {
                tabPanel.style.display = 'none';
            } else {
                const tab = document.createElement('button');
                tab.setAttribute('role', 'tab');
                tab.setAttribute('aria-controls', tabPanel.id);
                tab.innerText = tabPanel.title;
                tab.onclick = () => this.activatePanel(tabPanel.id);
                this.tabList.appendChild(tab);
            }
        });
        this.update();
    }

    activatePanel(id) {
        this.slot.assignedElements().forEach(tabPanel => {
            if (tabPanel.id === id) {
                tabPanel.setAttribute('active', 'true');
            } else {
                tabPanel.removeAttribute('active');
            }
        });
        this.update();
    }

    update() {
        this.slot.assignedElements().forEach(tabPanel => {
            const tab = this.tabList.querySelector(`[aria-controls="${tabPanel.id}"]`);
            tab.setAttribute('aria-selected', tabPanel.hasAttribute('active'));
        })
    }
}

class Tab extends HTMLElement {

    static #nextId = 0;

    constructor() {
        super();
        this.attachShadow({ mode: 'open' });
    }

    connectedCallback() {
        this.role = 'tabpanel';
        this.id = 'tab-panel-' + Tab.#nextId++;
        this.shadowRoot.appendChild(document.createElement('slot'));
    }
}

export const registerTabPanelComponent = 
    () => {
        customElements.define('x-tab-panel', TabPanel);
        customElements.define('x-tab', Tab);
    }
