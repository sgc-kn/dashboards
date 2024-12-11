function patchCardInfoButtons() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const infoButton = card.querySelector('.info-button');
        const closeButton = card.querySelector('.close-button');
        if (closeButton) {
            closeButton.addEventListener('click', () => {
                card.classList.toggle('flip');
            });
        }
        if (infoButton) {
            infoButton.addEventListener('click', () => {
                card.classList.toggle('flip');
            });
        }
    });
}

document.addEventListener('DOMContentLoaded', () => {
    patchCardInfoButtons();
});