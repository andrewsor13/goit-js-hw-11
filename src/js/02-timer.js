import flatpickr from 'flatpickr';
import Notiflix from 'notiflix';
import 'flatpickr/dist/flatpickr.min.css';

const timerElements = {
  days: document.querySelector('.value[data-days]'),
  hours: document.querySelector('.value[data-hours]'),
  minutes: document.querySelector('.value[data-minutes]'),
  seconds: document.querySelector('.value[data-seconds]'),
};

const startBtn = document.querySelector('button[data-start]');
const myInput = document.querySelector('#datetime-picker');

let countdownIntervalId;
let countdownEndTime;

startBtn.disabled = true;

flatpickr(myInput, {
  enableTime: true,
  time_24hr: true,
  defaultDate: new Date(),
  minuteIncrement: 1,
  onClose(selectedDates) {
    const selectedDate = selectedDates[0];

    if (selectedDate > new Date()) {
      startBtn.disabled = false;
      countdownEndTime = selectedDate;
    } else {
      startBtn.disabled = true;
      Notiflix.Notify.failure('Please choose a future date and time');
    }
  },
});

startBtn.addEventListener('click', () => {
  startTimer();
  startBtn.disabled = true;
});

function startTimer() {
  countdownIntervalId = setInterval(updateCountdown, 1000);
  updateCountdown();
}

function updateCountdown() {
  const timeDiff = countdownEndTime - new Date();

  if (timeDiff <= 0) {
    clearInterval(countdownIntervalId);
    startBtn.disabled = false;
    Notiflix.Notify.success('Countdown completed!');
    return;
  }

  const { days, hours, minutes, seconds } = convertMs(timeDiff);
  timerElements.days.textContent = addLeadingZero(days);
  timerElements.hours.textContent = addLeadingZero(hours);
  timerElements.minutes.textContent = addLeadingZero(minutes);
  timerElements.seconds.textContent = addLeadingZero(seconds);
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

function addLeadingZero(value) {
  return value.toString().padStart(2, '0');
}
