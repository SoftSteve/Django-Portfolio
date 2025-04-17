const button = document.querySelector('.button');
const overlay = document.querySelector('.overlay');

button.addEventListener('click', () => {
    overlay.classList.toggle('active');
});

document.addEventListener('click', (e) => {
    const isClickInside = overlay.querySelector('.modal-container').contains(e.target);
    const isButtonClick = button.contains(e.target);

    if (!isClickInside && !isButtonClick) {
        overlay.classList.remove('active');
    }
});