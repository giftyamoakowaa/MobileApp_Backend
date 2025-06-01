document.addEventListener('DOMContentLoaded', async () => {
    const API_BASE_URL = 'https://mobileapp-backend-1.onrender.com'; // Your backend URL

    const chapterPageTitle = document.getElementById('chapterPageTitle');
    const currentChapterTitle = document.getElementById('currentChapterTitle');
    const currentChapterContent = document.getElementById('currentChapterContent');
    const prevChapterBtn = document.getElementById('prevChapterBtn');
    const nextChapterBtn = document.getElementById('nextChapterBtn');
    const logoutBtn = document.getElementById('logoutBtn');

    // --- DEBUGGING: Initial check on DOMContentLoaded ---
    console.log("chapter.js: DOMContentLoaded - script started.");
    let initialTokenCheck = localStorage.getItem('token');
    console.log("chapter.js: Initial token found in localStorage:", initialTokenCheck);
    // --- END DEBUGGING ---

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
        // --- DEBUGGING: Check token within fetchAllChaptersForBook ---
        console.log("fetchAllChaptersForBook: Attempting to fetch chapters for bookId:", bookId);
        console.log("fetchAllChaptersForBook: Token being used:", token ? "present" : "NOT present");
        // --- END DEBUGGING ---

        try {
            const response = await fetch(`${API_BASE_URL}/api/chapters/book/${bookId}`, {
                headers: { 'Authorization': `Bearer ${token}` }
            });
            // --- DEBUGGING: Raw API response for chapters ---
            console.log("fetchAllChaptersForBook: Raw API Response:", response);
            console.log("fetchAllChaptersForBook: API Response Status:", response.status);
            // --- END DEBUGGING ---

            if (!response.ok) {
                if (response.status === 404) {
                    console.warn('No chapters found for this book.');
                    return [];
                }
                // --- DEBUGGING: Error status from API ---
                console.error("fetchAllChaptersForBook: API returned an error status:", response.status);
                // --- END DEBUGGING ---
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const chapters = await response.json();
            // --- DEBUGGING: Chapters data received ---
            console.log("fetchAllChaptersForBook: Chapters data received:", chapters);
            // --- END DEBUGGING ---
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
        // --- DEBUGGING: Check token within displayChapter ---
        const tokenInDisplayChapter = localStorage.getItem('token');
        console.log("displayChapter: Token found in localStorage:", tokenInDisplayChapter ? "present" : "NOT present");
        // --- END DEBUGGING ---
        if (!tokenInDisplayChapter) {
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
    if (prevChapterBtn) { // Added checks for button existence
        prevChapterBtn.addEventListener('click', () => {
            const currentChapterIndex = chaptersForCurrentBook.findIndex(ch => ch.chapterNumber === currentChapterNumber);
            if (currentChapterIndex > 0) {
                currentChapterNumber = chaptersForCurrentBook[currentChapterIndex - 1].chapterNumber;
                displayChapter(currentChapterNumber);
            }
        });
    }

    if (nextChapterBtn) { // Added checks for button existence
        nextChapterBtn.addEventListener('click', () => {
            const currentChapterIndex = chaptersForCurrentBook.findIndex(ch => ch.chapterNumber === currentChapterNumber);
            if (currentChapterIndex < chaptersForCurrentBook.length - 1) {
                currentChapterNumber = chaptersForCurrentBook[currentChapterIndex + 1].chapterNumber;
                displayChapter(currentChapterNumber);
            }
        });
    }

    // Initial load logic
    const params = getQueryParams();
    currentBookId = params.bookId;
    currentChapterNumber = parseInt(params.chapterNumber) || 1; // Default to chapter 1

    // --- DEBUGGING: Initial load token check details ---
    console.log("chapter.js: Initial load logic - checking bookId and token.");
    console.log("chapter.js: currentBookId from URL params:", currentBookId);
    // --- END DEBUGGING ---

    if (currentBookId) {
        const token = localStorage.getItem('token');
        // --- DEBUGGING: Token check before redirection ---
        console.log("chapter.js: Initial load token value before redirect check:", token);
        if (!token) {
            console.log("chapter.js: Initial load: No token found, redirecting to index.html."); // This line should appear if it redirects
            alert('You need to be logged in to view chapters.');
            window.location.href = '/index.html';
            return;
        }
        // --- END DEBUGGING ---

        chaptersForCurrentBook = await fetchAllChaptersForBook(currentBookId, token);
        if (chaptersForCurrentBook.length > 0) {
            displayChapter(currentChapterNumber);
        } else {
            currentChapterTitle.textContent = "No Chapters Available";
            currentChapterContent.textContent = "This book currently has no chapters.";
            // --- DEBUGGING: No chapters found ---
            console.log("chapter.js: No chapters found for this book after fetch.");
            // --- END DEBUGGING ---
        }
    } else {
        currentChapterTitle.textContent = "Error: Book ID missing";
        currentChapterContent.textContent = "Please go back to the books page and select a book.";
        // --- DEBUGGING: Book ID missing ---
        console.error("chapter.js: Book ID missing from URL parameters.");
        // --- END DEBUGGING ---
    }
});