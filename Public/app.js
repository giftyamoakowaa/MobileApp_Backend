document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://mobileapp-backend-1.onrender.com';
    const bookListContainer = document.getElementById('book-list');
    const logoutButton = document.getElementById("logoutBtn");

    // --- Authentication Check ---
    const token = localStorage.getItem('token');
    console.log("app.js: Running authentication check.");
    console.log("app.js: Token found in localStorage on stories.html load:", token);
    if (!token) {
        console.log("app.js: No token found, redirecting to index.html.");
        window.location.href = '/index.html';
        return;
    }

    // --- Logout Functionality ---
    if (logoutButton) {
        logoutButton.addEventListener("click", () => {
            localStorage.removeItem("token");
            localStorage.removeItem("username"); // Assuming you store username
            window.location.href = "/index.html"; // Redirect to login page
        });
    } else {
        console.warn("Logout button not found. Ensure 'logoutBtn' ID is correct.");
    }
    // --- END Logout Functionality ---


    // --- Function to fetch and display books ---
    async function fetchBooks() {
        try {
            // Fetch books with authentication token
            console.log("fetchBooks: Attempting to fetch books with token..."); // ADD THIS LINE
            const response = await fetch(`${API_BASE_URL}/api/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            console.log("fetchBooks: Raw API Response for books:", response); // ADD THIS LINE
            if (!response.ok) {
                console.log("fetchBooks: API response for books not OK. Status:", response.status); // ADD THIS LINE
                // If token is invalid or expired, redirect to login
                if (response.status === 401 || response.status === 403) {
                    console.log("fetchBooks: Detected 401/403 status from API, redirecting to login."); // ADD THIS LINE
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = '/index.html';
                    return;
                }
                throw new Error(`Failed to fetch books: ${response.statusText}`);
            }

            const books = await response.json();
            console.log("fetchBooks: Books data received:", books); // ADD THIS LINE
            bookListContainer.innerHTML = ''; // Clear existing content

            if (books.length === 0) {
                bookListContainer.innerHTML = '<p class="text-center text-gray-600">No books found. Check back later!</p>';
                return;
            }
            // ... (rest of your book display loop) ...
            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');
                const coverImage = document.createElement('img');
                coverImage.src = book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover';
                coverImage.alt = `Cover for ${book.title}`;
                bookCard.appendChild(coverImage);
                const bookCardContent = document.createElement('div');
                bookCardContent.classList.add('book-card-content');
                bookCard.appendChild(bookCardContent);
                const titleElement = document.createElement('h3');
                titleElement.textContent = book.title;
                bookCardContent.appendChild(titleElement);
                const likesElement = document.createElement('span');
                likesElement.textContent = `Likes: ${book.likes || 0}`;
                likesElement.classList.add('like-count');
                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('card-actions');
                const likeButton = document.createElement('button');
                likeButton.classList.add('like-btn');
                likeButton.innerHTML = `<i class="fa-regular fa-heart"></i> ${book.likes || 0}`;
                likeButton.addEventListener('click', (e) => {
                    e.stopPropagation();
                    alert('Like feature coming soon!');
                });
                const readChaptersButton = document.createElement('button');
                readChaptersButton.classList.add('read-chapters-btn');
                readChaptersButton.textContent = 'Read Chapters';
                readChaptersButton.addEventListener('click', () => {
                    const bookId = book._id;
                    const initialChapterNumber = 1;
                    window.location.href = `/chapter.html?bookId=${bookId}&chapterNumber=${initialChapterNumber}`;
                });
                buttonGroup.appendChild(likeButton);
                buttonGroup.appendChild(readChaptersButton);
                bookCardContent.appendChild(buttonGroup);
                bookListContainer.appendChild(bookCard);
            });
        } catch (error) {
            console.error("Error fetching books:", error);
            bookListContainer.innerHTML = '<p class="text-center text-red-500">Failed to load books. Please try again later.</p>';
        }
    }

    // Call fetchBooks when the DOM is ready
    fetchBooks();

    // --- REMOVE SERVICE WORKER REGISTRATION (as you don't want PWA for now) ---
    // if ('serviceWorker' in navigator) {
    //   window.addEventListener('load', () => {
    //     navigator.serviceWorker.register('/service-worker.js').then((registration) => {
    //       console.log('Service Worker registered with success:', registration);
    //     }).catch((error) => {
    //       console.log('Service Worker registration failed:', error);
    //     });
    //   });
    // }
    // --- END REMOVE ---
});