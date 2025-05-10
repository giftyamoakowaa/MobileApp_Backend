const apiUrl = "https://mobileapp-backend-1.onrender.com/api";
const token = localStorage.getItem("token");

// Redirect to login if user is not authenticated
if (!token) {
    window.location.href = "index.html";
}

// Get Story ID from URL
const urlParams = new URLSearchParams(window.location.search);
const storyId = urlParams.get("id");

// Fetch Story Details
const fetchStoryDetails = async () => {
    try {
        const response = await fetch(`${apiUrl}/stories/${storyId}`, {
            headers: { Authorization: `Bearer ${token}` },
        });

        const story = await response.json();
        document.getElementById("storyTitle").textContent = story.title;
        document.getElementById("storyDescription").textContent = story.description;

        displayChapters(story.chapters);
    } catch (error) {
        console.error("Error fetching story details:", error);
    }
};

// Display Chapters
const displayChapters = (chapters) => {
    const container = document.getElementById("chaptersContainer");
    container.innerHTML = "";

    chapters.forEach((chapter) => {
        const chapterDiv = document.createElement("div");
        chapterDiv.classList.add("chapter");

        chapterDiv.innerHTML = `
            <h3>${chapter.title}</h3>
            <p>${chapter.content}</p>
            <button onclick="likeChapter('${chapter._id}')">Like (${chapter.likes.length})</button>
            <div>
                <input type="text" id="comment-${chapter._id}" placeholder="Add a comment">
                <button onclick="addComment('${chapter._id}')">Comment</button>
            </div>
            <div id="comments-${chapter._id}">
                ${chapter.comments.map(comment => `<p>${comment.username}: ${comment.text}</p>`).join("")}
            </div>
        `;

        container.appendChild(chapterDiv);
    });
};

// Like a Chapter
const likeChapter = async (chapterId) => {
    try {
        const response = await fetch(`${apiUrl}/chapters/${chapterId}/like`, {
            method: "POST",
            headers: { Authorization: `Bearer ${token}` },
        });

        if (response.ok) {
            fetchStoryDetails(); // Refresh the page to update likes
        }
    } catch (error) {
        console.error("Error liking chapter:", error);
    }
};

// Add a Comment
const addComment = async (chapterId) => {
    const commentText = document.getElementById(`comment-${chapterId}`).value;

    if (!commentText) return alert("Comment cannot be empty!");

    try {
        const response = await fetch(`${apiUrl}/chapters/${chapterId}/comment`, {
            method: "POST",
            headers: { 
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}` 
            },
            body: JSON.stringify({ text: commentText }),
        });

        if (response.ok) {
            fetchStoryDetails(); // Refresh the page to update comments
        }
    } catch (error) {
        console.error("Error adding comment:", error);
    }
};

// Logout Function
document.getElementById("logoutBtn").addEventListener("click", () => {
    localStorage.removeItem("token");
    window.location.href = "login.html";
});

// Load Story Details when Page Loads
window.onload = fetchStoryDetails;
