// Функція для генерування випадкового кольору
function getRandomHexColor() {
    return `#${Math.floor(Math.random() * 16777215).toString(16).padStart(6, '0')}`;
}

// Отримуємо посилання на кнопки з DOM
const startButton = document.querySelector('[data-start]');
const stopButton = document.querySelector('[data-stop]');

let intervalId = null;

// Функція для зміни кольору фону
function changeBackgroundColor() {
    document.body.style.backgroundColor = getRandomHexColor();
}

// Обробник натискання кнопки "Start"
function handleStartClick() {
    if (intervalId) return; // Ігноруємо, якщо зміна кольору вже запущена

    intervalId = setInterval(changeBackgroundColor, 1000);
    startButton.disabled = true;
    stopButton.disabled = false;
}

// Обробник натискання кнопки "Stop"
function handleStopClick() {
    if (!intervalId) return; // Ігноруємо, якщо зміна кольору не запущена

    clearInterval(intervalId);
    intervalId = null;
    startButton.disabled = false;
    stopButton.disabled = true;
}

// Додаємо обробники подій для кнопок
startButton.addEventListener('click', handleStartClick);
stopButton.addEventListener('click', handleStopClick);

