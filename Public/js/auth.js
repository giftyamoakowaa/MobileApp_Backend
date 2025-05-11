// const apiUrl = 'https://mobileapp-backend-1.onrender.com/api/auth';

// document.addEventListener('DOMContentLoaded', () => {
//     const signupForm = document.getElementById('signupForm');
//     const loginForm = document.getElementById('loginForm'); // Get the login form

//     if (signupForm) {
//         signupForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const username = document.getElementById('username').value.trim();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();
//             const confirmPassword = document.getElementById('confirmPassword').value.trim();

//             if (password !== confirmPassword) {
//                 alert('Passwords do not match!');
//                 return;
//             }

//             try {
//                 const response = await fetch(`${apiUrl}/signup`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ username, email, password, confirmPassword }),
//                 });

//                 const result = await response.json();

//                 if (response.ok) {
//                     alert('Signup successful! Please login.');
//                     window.location.href = 'index.html'; // Or 'login.html', depending on your flow
//                 } else {
//                     alert(result.message || 'Signup failed!');
//                 }
//             } catch (error) {
//                 console.error('Signup Error:', error);
//                 alert('An error occurred during signup.');
//             }
//         });
//     }

//     if (loginForm) {
//         loginForm.addEventListener('submit', async (e) => {
//             e.preventDefault();
//             const email = document.getElementById('email').value.trim();
//             const password = document.getElementById('password').value.trim();

//             try {
//                 const response = await fetch(`${apiUrl}/login`, {
//                     method: 'POST',
//                     headers: { 'Content-Type': 'application/json' },
//                     body: JSON.stringify({ email, password }),
//                 });

//                 console.log("Raw Response (Login):", response); // ADDED THIS LINE FOR DEBUGGING

//                 // IMPORTANT:  Check response.ok *before* trying to parse as JSON
//                 if (!response.ok) {
//                     //  If the server didn't respond with a 2xx status, we *don't* assume JSON
//                     const text = await response.text(); // Get the response as plain text
//                     console.error("Server Error Response (Login):", text); // Log the error text
//                     throw new Error(`Login failed: ${response.status} - ${text}`); //  Include status
//                 }

//                 const result = await response.json();  //  *NOW* we parse as JSON, because response.ok

//                 console.log("Parsed Response Data (Login):", result); // ADDED THIS LINE FOR DEBUGGING


//                 if (response.ok) {
//                     localStorage.setItem('token', result.token);
//                     alert('Login successful!');
//                     window.location.href = 'stories.html'; //  Adjust the redirection as necessary
//                 } else {
//                     alert(result.message || 'Login failed!');
//                 }
//             } catch (error) {
//                 console.error('Login Error:', error);
//                 alert('An error occurred during login.');
//             }
//         });
//     }
// });



const apiUrl = 'https://mobileapp-backend-1.onrender.com/api/auth';

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
                    window.location.href = 'index.html';
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
                const response = await fetch(`${apiUrl}/login`, {  //  Correct URL
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' }, //  Correct Header
                    body: JSON.stringify({ email, password }),       //  Correct Body
                });

                console.log("Raw Response (Login):", response);  //  IMPORTANT DEBUG:  See the *raw* response

                if (!response.ok) {  //  Check for HTTP errors FIRST
                    const errorText = await response.text();  // Get the *text* of the error
                    console.error("Server Error (Login):", errorText);
                    throw new Error(`Login failed: ${response.status} - ${errorText}`);
                }

                const result = await response.json(); // Parse JSON *after* checking response.ok

                console.log("Parsed Response Data (Login):", result);

                if (response.ok) { //redundant check
                    localStorage.setItem('token', result.token);
                    alert('Login successful!');
                    window.location.href = 'stories.html';
                } else {
                    alert(result.message || 'Login failed!');
                }

            } catch (error) {
                console.error('Login Error:', error);
                alert(error.message); // Show error from fetch or JSON parsing
            }
        });
    }
});
