function getRandomHexColor() {
  return `#${Math.floor(Math.random() * 16777215)
    .toString(16)
    .padStart(6, 0)}`;
}

const StartBtn = document.querySelector('[data-start]');
const StopBtn = document.querySelector('[data-stop]');

StartBtn.addEventListener('click', () => {
  timerId = setInterval(() => {
    document.body.style.backgroundColor = getRandomHexColor();
  }, 1000);
});

StopBtn.addEventListener('click', () => {
  clearInterval(timerId);
});
