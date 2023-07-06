import { Notify } from 'notiflix';

const form = document.querySelector('form.form');
const inputDelayEl = document.querySelector('input[name="delay"]');
const inputStepEl = document.querySelector('input[name="step"]');
const inputAmountEl = document.querySelector('input[name="amount"]');

function createPromise(position, delay) {
  return new Promise((resolve, reject) => {
    setTimeout(() => {
      const shouldResolve = Math.random() > 0.3;
      if (shouldResolve) {
        resolve({ position, delay });
      } else {
        reject({ position, delay });
      }
    }, delay);
  });
}

function onSubmit(event) {
  event.preventDefault();
  const delay = Number(inputDelayEl.value);
  const step = Number(inputStepEl.value);
  const amount = Number(inputAmountEl.value);

  if (amount <= 0 || delay < 0 || step < 0) {
    Notify.failure('Please input correct values (>=0)');
    return;
  }

  form.reset();
  let position = 0;
  let currentDelay = delay;

  for (let i = 0; i < amount; i++) {
    position++;
    createPromise(position, currentDelay)
      .then(({ position, delay }) => {
        Notify.success(`✅ Fulfilled promise ${position} in ${delay}ms`);
      })
      .catch(({ position, delay }) => {
        Notify.failure(`❌ Rejected promise ${position} in ${delay}ms`);
      });
    currentDelay += step;
  }
}

form.addEventListener('submit', onSubmit);
