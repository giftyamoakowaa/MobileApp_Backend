document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://mobileapp-backend-1.onrender.com'; // Your backend URL

    const chapterPageTitle = document.getElementById('chapterPageTitle');
    const currentChapterTitle = document.getElementById('currentChapterTitle');
    const currentChapterContent = document.getElementById('currentChapterContent');
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    let currentBookId = null;
    let currentChapterNumber = 1;
    let chaptersForCurrentBook = []; // Store all chapters for the current book to enable navigation

    // Handle Logout
    if (logoutBtn) {
        logoutBtn.addEventListener('click', (e) => {
            e.preventDefault();
            localStorage.removeItem('token');
            localStorage.removeItem('username'); // Assuming you store username too
            window.location.href = '/index.html';
        });
    }

    // Function to parse URL query parameters
    function getQueryParams() {
        const params = {};
        window.location.search.substring(1).split('&').forEach(param => {
            const parts = param.split('=');
            if (parts[0]) {
                params[parts[0]] = decodeURIComponent(parts[1]);
            }
        });
        return params;
    }

    // Function to fetch all chapters for a given book
    async function fetchAllChaptersForBook(bookId, token) {
        try {
            const response = await fetch(`${API_BASE_URL}/api/chapters/book/${bookId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('No chapters found for this book.');
                    return [];
                }
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const chapters = await response.json();
            // Sort chapters by chapterNumber to ensure correct navigation order
            return chapters.sort((a, b) => a.chapterNumber - b.chapterNumber);
        } catch (error) {
            console.error('Error fetching all chapters for book:', error);
            alert('Failed to load chapters for this book.');
            return [];
        }
    }

    // Function to display a specific chapter
    async function displayChapter(chapterNumber) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('Please log in to read chapters.');
            window.location.href = '/index.html';
            return;
        }

        const chapterIndex = chaptersForCurrentBook.findIndex(ch => ch.chapterNumber === chapterNumber);

        if (chapterIndex !== -1) {
            const chapter = chaptersForCurrentBook[chapterIndex];
            chapterPageTitle.textContent = `${chapter.title} - Pathfinders' Library`;
            currentChapterTitle.textContent = chapter.title;
            currentChapterContent.textContent = chapter.content; // Use textContent for plain text

            // Update navigation buttons
            prevChapterBtn.disabled = chapterIndex === 0;
            nextChapterBtn.disabled = chapterIndex === chaptersForCurrentBook.length - 1;

            // Update URL in browser for direct linking/refreshing
            window.history.pushState({ bookId: currentBookId, chapterNumber: chapterNumber }, '', `?bookId=${currentBookId}&chapterNumber=${chapterNumber}`);

        } else {
            currentChapterTitle.textContent = "Chapter Not Found";
            currentChapterContent.textContent = "The requested chapter could not be found.";
            prevChapterBtn.disabled = true;
            nextChapterBtn.disabled = true;
        }
    }

    // Event listeners for navigation buttons
    prevChapterBtn.addEventListener('click', () => {
        const currentChapterIndex = chaptersForCurrentBook.findIndex(ch => ch.chapterNumber === currentChapterNumber);
        if (currentChapterIndex > 0) {
            currentChapterNumber = chaptersForCurrentBook[currentChapterIndex - 1].chapterNumber;
            displayChapter(currentChapterNumber);
        }
    });

    nextChapterBtn.addEventListener('click', () => {
        const currentChapterIndex = chaptersForCurrentBook.findIndex(ch => ch.chapterNumber === currentChapterNumber);
        if (currentChapterIndex < chaptersForCurrentBook.length - 1) {
            currentChapterNumber = chaptersForCurrentBook[currentChapterIndex + 1].chapterNumber;
            displayChapter(currentChapterNumber);
        }
    });

    // Initial load logic
    const params = getQueryParams();
    currentBookId = params.bookId;
    currentChapterNumber = parseInt(params.chapterNumber) || 1; // Default to chapter 1

    if (currentBookId) {
        const token = localStorage.getItem('token');
        if (!token) {
            alert('You need to be logged in to view chapters.');
            window.location.href = '/index.html';
            return;
        }
        chaptersForCurrentBook = await fetchAllChaptersForBook(currentBookId, token);
        if (chaptersForCurrentBook.length > 0) {
            displayChapter(currentChapterNumber);
        } else {
            currentChapterTitle.textContent = "No Chapters Available";
            currentChapterContent.textContent = "This book currently has no chapters.";
        }
    } else {
        currentChapterTitle.textContent = "Error: Book ID missing";
        currentChapterContent.textContent = "Please go back to the books page and select a book.";
    }
});