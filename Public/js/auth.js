const apiUrl = 'http://localhost:3000/api/auth';

document.addEventListener('DOMContentLoaded', () => {
  const signupForm = document.getElementById('signupForm');
  const loginForm = document.getElementById('loginForm');

  if (signupForm) {
    signupForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const username = document.getElementById('username').value.trim();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();
      const confirmPassword = document.getElementById('confirmPassword').value.trim();

      if (password !== confirmPassword) {
        alert('Passwords do not match!');
        return;
      }

      try {
        const response = await fetch(`${apiUrl}/signup`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ username, email, password, confirmPassword }),
        });

        const result = await response.json();

        if (response.ok) {
          alert('Signup successful! Please login.');
          window.location.href = 'login.html';
        } else {
          alert(result.message || 'Signup failed!');
        }
      } catch (error) {
        console.error('Signup Error:', error);
        alert('An error occurred during signup.');
      }
    });
  }

  if (loginForm) {
    loginForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const email = document.getElementById('email').value.trim();
      const password = document.getElementById('password').value.trim();

      try {
        const response = await fetch(`${apiUrl}/login`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ email, password }),
        });

        const result = await response.json();

        if (response.ok) {
          localStorage.setItem('token', result.token);
          alert('Login successful!');
          window.location.href = 'stories.html';
        } else {
          alert(result.message || 'Login failed!');
        }
      } catch (error) {
        console.error('Login Error:', error);
        alert('An error occurred during login.');
      }
    });
  }
});