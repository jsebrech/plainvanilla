function transition() {
    const square1 = document.getElementById('square1');
    const square2 = document.getElementById('square2');
    if (document.startViewTransition) {
        document.startViewTransition(() => {
            square1.classList.toggle('toggled');
            square2.classList.toggle('toggled');
        });
    } else {
        square1.classList.toggle('toggled');
        square2.classList.toggle('toggled');
    }
}
