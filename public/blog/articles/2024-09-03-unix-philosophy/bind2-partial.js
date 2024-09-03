export const bind = (template, target) => {
    if (!template.content) {
        const text = template;
        template = document.createElement('template');
        template.innerHTML = text;
    }
    const fragment = template.content.cloneNode(true);
// ...
}