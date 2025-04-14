const isLocalhost = window.location.hostname === 'localhost';
const apiUrl = isLocalhost
  ? 'http://localhost:3000/api/auth'
  : '/.netlify/functions/auth-api/api/auth';

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

function showMessage(message, type = 'error') {
  const messageDiv = document.getElementById('formMessage');
  if (!messageDiv) return;

  messageDiv.textContent = message;
  messageDiv.className = `message ${type}`;
  messageDiv.style.display = 'block';
}

if (!username || username.length < 3) {
  showMessage('Username must be at least 3 characters.');
  return;
}
if (!email.includes('@')) {
  showMessage('Invalid email address.');
  return;
}
if (password.length < 6) {
  showMessage('Password must be at least 6 characters.');
  return;
}


function isTokenExpired(token) {
  try {
    const payload = JSON.parse(atob(token.split('.')[1]));
    const now = Math.floor(Date.now() / 1000);
    return payload.exp < now;
  } catch (err) {
    return true;
  }
}

const token = localStorage.getItem('token');
if (!token || isTokenExpired(token)) {
  localStorage.removeItem('token');
  window.location.href = 'login.html';
}



// const apiUrl = '/.netlify/functions/auth-api/api/auth';

// document.addEventListener('DOMContentLoaded', () => {
//   const signupForm = document.getElementById('signupForm');
//   const loginForm = document.getElementById('loginForm');

//   if (signupForm) {
//     signupForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       const username = document.getElementById('username').value.trim();
//       const email = document.getElementById('email').value.trim();
//       const password = document.getElementById('password').value.trim();
//       const confirmPassword = document.getElementById('confirmPassword').value.trim();

//       if (password !== confirmPassword) {
//         alert('Passwords do not match!');
//         return;
//       }

//       try {
//         const response = await fetch(`${apiUrl}/signup`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ username, email, password, confirmPassword }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//           alert('Signup successful! Please login.');
//           window.location.href = 'login.html';
//         } else {
//           alert(result.message || 'Signup failed!');
//         }
//       } catch (error) {
//         console.error('Signup Error:', error);
//         alert('An error occurred during signup.');
//       }
//     });
//   }

//   if (loginForm) {
//     loginForm.addEventListener('submit', async (e) => {
//       e.preventDefault();
//       const email = document.getElementById('email').value.trim();
//       const password = document.getElementById('password').value.trim();

//       try {
//         const response = await fetch(`${apiUrl}/login`, {
//           method: 'POST',
//           headers: { 'Content-Type': 'application/json' },
//           body: JSON.stringify({ email, password }),
//         });

//         const result = await response.json();

//         if (response.ok) {
//           localStorage.setItem('token', result.token);
//           alert('Login successful!');
//           window.location.href = 'stories.html';
//         } else {
//           alert(result.message || 'Login failed!');
//         }
//       } catch (error) {
//         console.error('Login Error:', error);
//         alert('An error occurred during login.');
//       }
//     });
//   }
// });