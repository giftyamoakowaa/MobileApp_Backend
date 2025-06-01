document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://mobileapp-backend-1.onrender.com';
    const bookListContainer = document.getElementById('book-list');
    const logoutButton = document.getElementById("logoutBtn");

    // --- Authentication Check ---
    const token = localStorage.getItem('token');
    // --- ADD THESE TWO LINES FOR DEBUGGING ---
    console.log("app.js: Running authentication check.");
    console.log("app.js: Token found in localStorage on stories.html load:", token);
    // --- END ADDITION ---
    if (!token) {
        // If no token, redirect to login page
        console.log("app.js: No token found, redirecting to index.html."); // ADD THIS LINE FOR DEBUGGING
        window.location.href = '/index.html';
        return; // Stop further execution
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
            const response = await fetch(`${API_BASE_URL}/api/books`, {
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                // If token is invalid or expired, redirect to login
                if (response.status === 401 || response.status === 403) {
                    alert('Session expired or unauthorized. Please log in again.');
                    localStorage.removeItem('token');
                    window.location.href = '/index.html';
                    return;
                }
                throw new Error(`Failed to fetch books: ${response.statusText}`);
            }

            const books = await response.json();
            bookListContainer.innerHTML = ''; // Clear existing content

            if (books.length === 0) {
                bookListContainer.innerHTML = '<p class="text-center text-gray-600">No books found. Check back later!</p>';
                return;
            }

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');

                // Create and add the image element
                const coverImage = document.createElement('img');
                coverImage.src = book.coverImage || 'https://via.placeholder.com/200x300?text=No+Cover'; // Fallback image
                coverImage.alt = `Cover for ${book.title}`;
                bookCard.appendChild(coverImage);

                // Create content wrapper for better layout with new CSS
                const bookCardContent = document.createElement('div');
                bookCardContent.classList.add('book-card-content');
                bookCard.appendChild(bookCardContent);


                const titleElement = document.createElement('h3');
                titleElement.textContent = book.title;
                bookCardContent.appendChild(titleElement); // Append to content wrapper


                // We'll add author or description here later if you want more detail
                // const authorElement = document.createElement('p');
                // authorElement.textContent = `By: ${book.author || 'Unknown'}`;
                // bookCardContent.appendChild(authorElement);


                // Moved likes into actions section for better styling if desired
                const likesElement = document.createElement('span'); // Use span or div for just text
                likesElement.textContent = `Likes: ${book.likes || 0}`; // Default to 0 if null
                likesElement.classList.add('like-count'); // Add a class for styling
                // We will add this to the action group or just display it

                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('card-actions'); // Use 'card-actions' class as per new CSS


                const likeButton = document.createElement('button');
                likeButton.classList.add('like-btn'); // Use 'like-btn' as per new CSS
                likeButton.innerHTML = `<i class="fa-regular fa-heart"></i> ${book.likes || 0}`; // Using icon and count
                // Add event listener for liking functionality (will need backend integration)
                likeButton.addEventListener('click', (e) => {
                    e.stopPropagation(); // Prevent card click if you make card clickable
                    alert('Like feature coming soon!'); // Placeholder
                    // You'll implement the actual like API call here
                });


                const readChaptersButton = document.createElement('button');
                readChaptersButton.classList.add('read-chapters-btn'); // Use 'read-chapters-btn' as per new CSS
                readChaptersButton.textContent = 'Read Chapters';

                // --- IMPORTANT CHANGE HERE: REDIRECT TO CHAPTER.HTML ---
                readChaptersButton.addEventListener('click', () => {
                    const bookId = book._id;
                    const initialChapterNumber = 1; // Always start with chapter 1 when navigating from books list
                    window.location.href = `/chapter.html?bookId=${bookId}&chapterNumber=${initialChapterNumber}`;
                });
                // --- END IMPORTANT CHANGE ---


                buttonGroup.appendChild(likeButton);
                // buttonGroup.appendChild(commentsButton); // Removed comments button for now, can add back if needed
                buttonGroup.appendChild(readChaptersButton);

                bookCardContent.appendChild(buttonGroup); // Append button group to content wrapper

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