// const apiUrl = "https://mobileapp-backend-1.onrender.com/api";
// const token = localStorage.getItem("token");

// // Redirect to login if user is not authenticated
// if (!token) {
//     window.location.href = "index.html";
// }

// // Get Story ID from URL
// const urlParams = new URLSearchParams(window.location.search);
// const storyId = urlParams.get("id");

// // Fetch Story Details
// const fetchStoryDetails = async () => {
//     try {
//         const response = await fetch(`${apiUrl}/stories/${storyId}`, {
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         const story = await response.json();
//         document.getElementById("storyTitle").textContent = story.title;
//         document.getElementById("storyDescription").textContent = story.description;

//         displayChapters(story.chapters);
//     } catch (error) {
//         console.error("Error fetching story details:", error);
//     }
// };

// // Display Chapters
// const displayChapters = (chapters) => {
//     const container = document.getElementById("chaptersContainer");
//     container.innerHTML = "";

//     chapters.forEach((chapter) => {
//         const chapterDiv = document.createElement("div");
//         chapterDiv.classList.add("chapter");

//         chapterDiv.innerHTML = `
//             <h3>${chapter.title}</h3>
//             <p>${chapter.content}</p>
//             <button onclick="likeChapter('${chapter._id}')">Like (${chapter.likes.length})</button>
//             <div>
//                 <input type="text" id="comment-${chapter._id}" placeholder="Add a comment">
//                 <button onclick="addComment('${chapter._id}')">Comment</button>
//             </div>
//             <div id="comments-${chapter._id}">
//                 ${chapter.comments.map(comment => `<p>${comment.username}: ${comment.text}</p>`).join("")}
//             </div>
//         `;

//         container.appendChild(chapterDiv);
//     });
// };

// // Like a Chapter
// const likeChapter = async (chapterId) => {
//     try {
//         const response = await fetch(`${apiUrl}/chapters/${chapterId}/like`, {
//             method: "POST",
//             headers: { Authorization: `Bearer ${token}` },
//         });

//         if (response.ok) {
//             fetchStoryDetails(); // Refresh the page to update likes
//         }
//     } catch (error) {
//         console.error("Error liking chapter:", error);
//     }
// };

// // Add a Comment
// const addComment = async (chapterId) => {
//     const commentText = document.getElementById(`comment-${chapterId}`).value;

//     if (!commentText) return alert("Comment cannot be empty!");

//     try {
//         const response = await fetch(`${apiUrl}/chapters/${chapterId}/comment`, {
//             method: "POST",
//             headers: { 
//                 "Content-Type": "application/json",
//                 Authorization: `Bearer ${token}` 
//             },
//             body: JSON.stringify({ text: commentText }),
//         });

//         if (response.ok) {
//             fetchStoryDetails(); // Refresh the page to update comments
//         }
//     } catch (error) {
//         console.error("Error adding comment:", error);
//     }
// };

// // Logout Function
// document.getElementById("logoutBtn").addEventListener("click", () => {
//     localStorage.removeItem("token");
//     window.location.href = "login.html";
// });

// // Load Story Details when Page Loads
// window.onload = fetchStoryDetails;



const apiUrl = "https://mobileapp-backend-1.onrender.com/api";
//const token = localStorage.getItem("token");  // Removed token check
// Removed the initial token check and redirect.  Assume we only get here if authenticated.


// Get Story ID from URL
const urlParams = new URLSearchParams(window.location.search);
const bookId = urlParams.get("id"); // Changed from storyId to bookId

const chapterDisplayArea = document.getElementById('chapter-display-area');
const chapterContentDiv = document.getElementById('chapter-content');
const chapterTitleElement = document.getElementById('chapter-title');
const chapterTextElement = document.getElementById('chapter-text');
const nextChapterButton = document.getElementById('next-chapter-button');
const prevChapterButton = document.getElementById('prev-chapter-button');
const closeChapterButton = document.getElementById('close-chapter-button');



// Fetch Story Details (Now fetches chapter details)
const fetchBookDetails = async () => { // Changed function name
    try {
        const response = await fetch(`${apiUrl}/books/${bookId}/chapters`, { // Adjusted API endpoint
            //headers: { Authorization: `Bearer ${token}` }, // Removed Authorization header
        });

        if (!response.ok) {
          throw new Error(`Failed to fetch chapters: ${response.status}`);
        }
        const chapters = await response.json();
        // document.getElementById("storyTitle").textContent = story.title;  //No longer used here
        // document.getElementById("storyDescription").textContent = story.description; //No longer used here

        displayChapters(chapters);
    } catch (error) {
        console.error("Error fetching chapter details:", error);
        chapterTextElement.innerHTML = `<p>Error loading chapters: ${error.message}</p>`;
        nextChapterButton.style.display = 'none';
        prevChapterButton.style.display = 'none';
    }
};

/**
 * Loads and displays a chapter's content.
 * @param {object} chapter - The chapter object from your API.
 */
function loadChapter(chapter) {
    if (!chapter) {
        chapterTextElement.innerHTML = "<p>Chapter not found.</p>";
        nextChapterButton.style.display = 'none';
        prevChapterButton.style.display = 'none';
        return;
    }

    currentChapterIndex = chapter.chapterNumber - 1;
    chapterTitleElement.textContent = chapter.title;
    chapterTextElement.innerHTML = '';

    const lines = chapter.content.split('\n');
    lines.forEach(line => {
        if (line.includes(':')) {
            const [speaker, ...textParts] = line.split(':');
            const text = textParts.join(':').trim();

            const dialogueParagraph = document.createElement('p');
            dialogueParagraph.classList.add('dialogue');

            const speakerSpan = document.createElement('span');
            speakerSpan.classList.add('speaker');
            speakerSpan.textContent = speaker.trim() + ':';

            const lineSpan = document.createElement('span');
            lineSpan.classList.add('line');
            lineSpan.textContent = text;

            dialogueParagraph.appendChild(speakerSpan);
            dialogueParagraph.appendChild(lineSpan);
            chapterTextElement.appendChild(dialogueParagraph);
        } else if (line.trim() !== "") {
            const narrativeParagraph = document.createElement('p');
            narrativeParagraph.textContent = line.trim();
            chapterTextElement.appendChild(narrativeParagraph);
        }
    });

    updateNavButtons();
}

// Display Chapters
const displayChapters = (chapters) => {
    window.chapters = chapters;
    if (chapters && chapters.length > 0) {
        loadChapter(chapters[0]);
    } else {
        chapterTextElement.innerHTML = "<p>No chapters found for this book.</p>";
        nextChapterButton.style.display = 'none';
        prevChapterButton.style.display = 'none';
    }
};

function updateNavButtons() {
    if (currentChapterIndex <= 0) {
        prevChapterButton.style.display = 'none';
    } else {
        prevChapterButton.style.display = 'block';
        prevChapterButton.onclick = () => {
            loadChapter(chapters[currentChapterIndex - 1]);
        };
    }

    if (currentChapterIndex < chapters.length - 1) {
        nextChapterButton.textContent = 'Next Chapter';
        nextChapterButton.style.display = 'block';
        nextChapterButton.onclick = () => {
            loadChapter(chapters[currentChapterIndex + 1]);
        };
    } else {
        nextChapterButton.textContent = 'Close';
        nextChapterButton.style.display = 'block';
        nextChapterButton.onclick = () => {
            window.location.href = 'Stories.html'; // Go back to the main page
        };
    }
}

closeChapterButton.onclick = () => {
    window.location.href = 'Stories.html';
};


// Load Story Details when Page Loads  (Now loads chapter details)
window.onload = fetchBookDetails; // Changed function name
