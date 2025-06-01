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
    const loginForm = document.getElementById('loginForm'); // Make sure this line is NOT commented out

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

    // --- START OF UNCOMMENTED LOGIN FORM LOGIC ---
    if (loginForm) { // UNCOMMENT THIS LINE
        loginForm.addEventListener('submit', async (e) => { // UNCOMMENT THIS LINE
            e.preventDefault(); // UNCOMMENT THIS LINE
            const email = document.getElementById('email').value.trim(); // UNCOMMENT THIS LINE
            const password = document.getElementById('password').value.trim(); // UNCOMMENT THIS LINE

            try { // UNCOMMENT THIS LINE
                const response = await fetch(`${apiUrl}/login`, { // UNCOMMENT THIS LINE
                    method: 'POST', // UNCOMMENT THIS LINE
                    headers: { 'Content-Type': 'application/json' }, // UNCOMMENT THIS LINE
                    body: JSON.stringify({ email, password }), // UNCOMMENT THIS LINE
                }); // UNCOMMENT THIS LINE

                // console.log("Raw Response (Login):", response); // Keep for debugging if needed, but not essential for functionality

                // IMPORTANT: Check response.ok *before* trying to parse as JSON
                if (!response.ok) { // UNCOMMENT THIS LINE
                    const text = await response.text(); // Get the response as plain text // UNCOMMENT THIS LINE
                    console.error("Server Error Response (Login):", text); // Log the error text // UNCOMMENT THIS LINE
                    throw new Error(`Login failed: ${response.status} - ${text}`); // Include status // UNCOMMENT THIS LINE
                } // UNCOMMENT THIS LINE

                const result = await response.json(); // *NOW* we parse as JSON, because response.ok // UNCOMMENT THIS LINE

                // console.log("Parsed Response Data (Login):", result); // Keep for debugging if needed

                // This condition `if (response.ok)` is redundant here because we already checked `!response.ok` above.
                // If we reach here, `response.ok` is guaranteed to be true.
                localStorage.setItem('token', result.token); // UNCOMMENT THIS LINE AND THIS IS THE KEY LINE
                alert('Login successful!'); // UNCOMMENT THIS LINE
                window.location.href = 'stories.html'; // UNCOMMENT THIS LINE // Adjust the redirection as necessary
                
            } catch (error) { // UNCOMMENT THIS LINE
                console.error('Login Error:', error); // UNCOMMENT THIS LINE
                alert('An error occurred during login.'); // UNCOMMENT THIS LINE
            } // UNCOMMENT THIS LINE
        }); // UNCOMMENT THIS LINE
    } // UNCOMMENT THIS LINE
    // --- END OF UNCOMMENTED LOGIN FORM LOGIC ---
});