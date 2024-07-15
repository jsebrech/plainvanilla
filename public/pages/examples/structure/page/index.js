const app = () => {
    const template = document.querySelector('template#page');
    if (template) document.body.appendChild(template.content, true);
}

document.addEventListener('DOMContentLoaded', app);
