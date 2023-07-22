// Импортируем flatpickr и его стили
import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix"; // Импортируем notiflix

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

// Функция додавания нуля перед числом, если оно меньше 10
function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

// Функция підрахунку часу до кінцевої дати
function calculateTimeRemaining(endDate) {
    const currentTime = new Date().getTime();
    const endTime = new Date(endDate).getTime();
    const timeRemaining = endTime - currentTime;

    if (timeRemaining <= 0) {
        // Если выбранная дата в прошлом, показываем сообщение с помощью notiflix
        Notiflix.Report.warning("Warning", "Please choose a date in the future", "OK");
        return null;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    return { days, hours, minutes, seconds };
}

// Функция перевода миллисекунд в дни, часы, минуты и секунды
function convertMs(ms) {
    const second = 1000;
    const minute = second * 60;
    const hour = minute * 60;
    const day = hour * 24;

    const days = Math.floor(ms / day);
    const hours = Math.floor((ms % day) / hour);
    const minutes = Math.floor(((ms % day) % hour) / minute);
    const seconds = Math.floor((((ms % day) % hour) % minute) / second);

    return { days, hours, minutes, seconds };
}

// Функция обновления значений таймера на странице
function updateTimerDisplay(time) {
    daysValue.textContent = addLeadingZero(time.days);
    hoursValue.textContent = addLeadingZero(time.hours);
    minutesValue.textContent = addLeadingZero(time.minutes);
    secondsValue.textContent = addLeadingZero(time.seconds);
}

// Инициализация flatpickr
const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        const endDate = selectedDates[0];
        if (endDate) {
            const timeRemaining = calculateTimeRemaining(endDate);
            if (timeRemaining) {
                startButton.removeAttribute("disabled");
                updateTimerDisplay(timeRemaining);
            }
        }
    },
};

flatpickr("#datetime-picker", options);

// Обработчик нажатия кнопки "Start"
startButton.addEventListener("click", () => {
    const endDate = flatpickr.parseDate(datetimePicker.value);
    const timeRemaining = calculateTimeRemaining(endDate);
    if (timeRemaining) {
        startButton.setAttribute("disabled", true);

        const intervalId = setInterval(() => {
            const updatedTime = calculateTimeRemaining(endDate);
            if (updatedTime) {
                updateTimerDisplay(updatedTime);
            } else {
                clearInterval(intervalId);
                startButton.removeAttribute("disabled");
            }
        }, 1000);
    }
});
