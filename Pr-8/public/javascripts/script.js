const counterEl = document.getElementById('counter');
const incrementBtn = document.getElementById('increment');
const decrementBtn = document.getElementById('decrement');
const resetBtn = document.getElementById('reset');

let count = initialCount;
counterEl.textContent = count;

function updateDisplay() {
  counterEl.textContent = count;

  // Send to server
  fetch('/update', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({ count })
  });
}

incrementBtn.onclick = () => {
  count++;
  updateDisplay();
};

decrementBtn.onclick = () => {
  if (count > 0) count--;
  updateDisplay();
};

resetBtn.onclick = () => {
  count = 0;
  updateDisplay();
};
