import flatpickr from "flatpickr";
import "flatpickr/dist/flatpickr.min.css";
import Notiflix from "notiflix";

const datetimePicker = document.getElementById("datetime-picker");
const startButton = document.querySelector("[data-start]");
const daysValue = document.querySelector("[data-days]");
const hoursValue = document.querySelector("[data-hours]");
const minutesValue = document.querySelector("[data-minutes]");
const secondsValue = document.querySelector("[data-seconds]");

function addLeadingZero(value) {
    return String(value).padStart(2, "0");
}

function calculateTimeRemaining(endDate) {
    const currentTime = new Date().getTime();
    const endTime = new Date(endDate).getTime();
    const timeRemaining = endTime - currentTime;

    if (timeRemaining <= 0) {
        Notiflix.Notify.failure('Please choose a date in the future');
        return null;
    }

    const { days, hours, minutes, seconds } = convertMs(timeRemaining);
    return { days, hours, minutes, seconds };
}

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

function updateTimerDisplay(time) {
    daysValue.textContent = addLeadingZero(time.days);
    hoursValue.textContent = addLeadingZero(time.hours);
    minutesValue.textContent = addLeadingZero(time.minutes);
    secondsValue.textContent = addLeadingZero(time.seconds);
}

let timerId;
function updateTimer(endDate) {
    const intervalId = setInterval(() => {
        const timeRemaining = calculateTimeRemaining(endDate);
        if (timeRemaining) {
            updateTimerDisplay(timeRemaining);
        } else {
            clearInterval(intervalId);
            startButton.removeAttribute("disabled");
        }
    }, 1000);

    return intervalId;
}

const options = {
    enableTime: true,
    time_24hr: true,
    defaultDate: new Date(),
    minuteIncrement: 1,
    onClose(selectedDates) {
        if (selectedDates[0] < new Date()) {
            Notiflix.Notify.failure('Please choose a date in the future');
            return;
        }
        startButton.removeAttribute('disabled');

        const showTimer = () => {
            const now = new Date();
            localStorage.setItem('selectedData', selectedDates[0]);
            const selectData = new Date(localStorage.getItem('selectedData'));

            if (!selectData) return;

            const diff = selectData - now;
            const { days, hours, minutes, seconds } = convertMs(diff);
            daysValue.textContent = addLeadingZero(days);
            hoursValue.textContent = addLeadingZero(hours);
            minutesValue.textContent = addLeadingZero(minutes);
            secondsValue.textContent = addLeadingZero(seconds);

            if (daysValue.textContent === '00' && hoursValue.textContent === '00' && minutesValue.textContent === '00' && secondsValue.textContent === '00') {
                clearInterval(timerId);
            }
        };

        const onClick = () => {
            if (timerId) {
                clearInterval(timerId);
            }
            showTimer();
            timerId = setInterval(showTimer, 1000);
        };

        startButton.addEventListener('click', onClick);
    },
};

flatpickr('#datetime-picker', { ...options });
