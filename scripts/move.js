// Обработчик события нажатия клавиши
document.addEventListener('keydown', (event) => {
    if (event.key === '1') {
        window.location.href = "./index.html";
    }
    if (event.key === '2') {
        window.location.href = "./plane.html";
    }
    if (event.key === '3') {
        window.location.href = "./geometry.html";
    }
});