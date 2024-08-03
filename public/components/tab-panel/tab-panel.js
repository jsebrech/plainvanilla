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

    #tablist;
    #observer;
    
    get tablist() { return this.#tablist; }
    get tabpanels() { return this.querySelectorAll('x-tab'); }

    constructor() {
        super();
        this.#observer = new MutationObserver(this.onMutation.bind(this));
        this.#observer.observe(this, { childList: true });
    }

    connectedCallback() {
        this.#tablist = document.createElement('div');
        this.#tablist.setAttribute('role', 'tablist');
        this.insertBefore(this.#tablist, this.firstChild);
    }

    onMutation(m) {
        if (m.filter(_ => _.type === 'childList').length) {
            this.tablist.innerHTML = '';
            this.tabpanels.forEach(tabPanel => {
                if (tabPanel.role !== 'tabpanel') {
                    tabPanel.style.display = 'none';
                } else {
                    const tab = document.createElement('button');
                    tab.setAttribute('role', 'tab');
                    tab.setAttribute('aria-controls', tabPanel.id);
                    tab.innerText = tabPanel.title;
                    tab.onclick = () => this.activatePanel(tabPanel.id);
                    this.tablist.appendChild(tab);
                }
            });                
        }
        this.update();
    }

    activatePanel(id) {
        this.tabpanels.forEach(tabPanel => {
            if (tabPanel.id === id) {
                tabPanel.setAttribute('active', 'true');
            } else {
                tabPanel.removeAttribute('active');
            }
        });
        this.update();
    }

    update() {
        this.tabpanels.forEach(tabPanel => {
            const tab = this.tablist.querySelector(`[aria-controls="${tabPanel.id}"]`);
            if (tab) tab.setAttribute('aria-selected', tabPanel.hasAttribute('active'));
        })
    }
}

class Tab extends HTMLElement {

    static #nextId = 0;

    connectedCallback() {
        this.role = 'tabpanel';
        this.id = 'tab-panel-' + Tab.#nextId++;
    }
}

export const registerTabPanelComponent = 
    () => {
        customElements.define('x-tab-panel', TabPanel);
        customElements.define('x-tab', Tab);
    }
