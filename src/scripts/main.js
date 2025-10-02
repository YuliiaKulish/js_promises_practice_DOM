'use strict';

function showNotification(type, message) {
  const div = document.createElement('div');

  div.className = `notification ${type}`;
  div.setAttribute('data-qa', 'notification');

  const title = document.createElement('div');

  title.className = 'notification__title';
  title.textContent = type === 'success' ? 'Success' : 'Error';

  const description = document.createElement('div');

  description.className = 'notification__description';
  description.textContent = message;

  div.appendChild(title);
  div.appendChild(description);
  document.body.appendChild(div);
}

let leftClicked = false;
let rightClicked = false;

const firstPromise = new Promise((resolve, reject) => {
  const timer = setTimeout(() => {
    if (!leftClicked) {
      reject(new Error('First promise was rejected'));
    }
  }, 3000);

  document.addEventListener('click', (e) => {
    if (e.button === 0 && !leftClicked) {
      leftClicked = true;
      clearTimeout(timer);
      resolve('First promise was resolved on a left click in the document');
    }
  });
});

const secondPromise = new Promise((resolve) => {
  let resolved = false;

  const handleLeftClick = (e) => {
    if (e.button === 0 && !resolved) {
      resolved = true;
      resolve('Second promise was resolved');
    }
  };

  const handleRightClick = (e) => {
    e.preventDefault();

    if (!resolved) {
      resolved = true;
      resolve('Second promise was resolved');
    }
  };

  document.addEventListener('click', handleLeftClick);
  document.addEventListener('contextmenu', handleRightClick);
});

const thirdPromise = new Promise((resolve) => {
  const checkBoth = () => {
    if (leftClicked && rightClicked) {
      resolve('Third promise was resolved');
    }
  };

  document.addEventListener('click', (e) => {
    if (e.button === 0) {
      leftClicked = true;
      checkBoth();
    }
  });

  document.addEventListener('contextmenu', (e) => {
    e.preventDefault();
    rightClicked = true;
    checkBoth();
  });
});

firstPromise
  .then((msg) => showNotification('success', msg))
  .catch((err) => showNotification('error', err.message));

secondPromise.then((msg) => showNotification('success', msg));

thirdPromise.then((msg) => showNotification('success', msg));
