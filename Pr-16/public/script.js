document.getElementById('contactForm').addEventListener('submit', async function(e) {
  e.preventDefault();
  const name = document.getElementById('name').value.trim();
  const email = document.getElementById('email').value.trim();
  const message = document.getElementById('message').value.trim();
  const formMessage = document.getElementById('formMessage');
  formMessage.textContent = '';

  if (name.length < 2) {
    formMessage.textContent = 'Name is required.';
    return;
  }
  const emailRegex = /^[^@\s]+@[^@\s]+\.[^@\s]+$/;
  if (!emailRegex.test(email)) {
    formMessage.textContent = 'Valid email is required.';
    return;
  }
  if (message.length < 10) {
    formMessage.textContent = 'Message must be at least 10 characters.';
    return;
  }

  try {
    const res = await fetch('/contact', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ name, email, message })
    });
    const data = await res.json();
    if (data.success) {
      formMessage.style.color = '#28a745';
      formMessage.textContent = data.message;
      document.getElementById('contactForm').reset();
    } else {
      formMessage.style.color = '#d9534f';
      formMessage.textContent = data.message;
    }
  } catch (err) {
    formMessage.style.color = '#d9534f';
    formMessage.textContent = 'Failed to send message.';
  }
});
