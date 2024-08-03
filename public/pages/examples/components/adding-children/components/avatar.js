/**
 * Usage:
 * <x-avatar src="https://.../avatar.png"></x-avatar>
 * <x-avatar src="https://.../avatar-large.png" size="lg"></x-avatar>
 */
class AvatarComponent extends HTMLElement {
    connectedCallback() {
        this.appendChild(document.createElement('img'));
        this.update();
    }

    static get observedAttributes() {
        return ['src', 'alt'];
    }

    attributeChangedCallback() {
        this.update();
    }

    update() {
        const img = this.querySelector('img');
        if (img) {
            img.src = this.getAttribute('src');
            img.alt = this.getAttribute('alt') || 'avatar';    
        }
    }
}

export const registerAvatarComponent = () => {
    customElements.define('x-avatar', AvatarComponent);
}
