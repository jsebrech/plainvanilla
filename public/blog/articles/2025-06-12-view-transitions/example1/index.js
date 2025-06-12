function transition() {
    const square1 = document.getElementById('square1');
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            square1.classList.toggle('toggled');
        });
    } else {
        square1.classList.toggle('toggled');
    }
}
