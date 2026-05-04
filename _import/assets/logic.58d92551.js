function patchCardInfoButtons() {
    const cards = document.querySelectorAll('.card');

    cards.forEach(card => {
        const infoButton = card.querySelector('.info-button');
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