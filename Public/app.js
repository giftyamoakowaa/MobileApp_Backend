document.addEventListener("DOMContentLoaded", () => {
    loadBooks();

    // Close chapter functionality
    const closeChapterButton = document.getElementById('close-chapter-button');
    const chapterContainer = document.getElementById('chapter-display-area');
    const chapterContentArea = document.getElementById('chapter-content');

    if (closeChapterButton && chapterContainer && chapterContentArea) {
        closeChapterButton.addEventListener('click', () => {
            chapterContainer.classList.remove('show');
            chapterContainer.classList.add('hidden');
            chapterContentArea.innerHTML = '';
            // Optionally reset chapter like state here if needed
        });
    } else {
        console.error("Close button or chapter container or content area not found!");
    }

    // Like chapter functionality
    const likeChapterButton = document.getElementById('like-chapter-button');
    const chapterLikesCount = document.getElementById('chapter-likes-count');
    let currentChapterId = null;
    let chapterLikes = 0;

    if (likeChapterButton && chapterLikesCount) {
        likeChapterButton.addEventListener('click', () => {
            if (currentChapterId) {
                fetch(`http://localhost:3000/api/chapters/${currentChapterId}/like`, {
                    method: "POST",
                })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to like chapter");
                    return response.json();
                })
                .then(data => {
                    chapterLikes = data.likes;
                    chapterLikesCount.textContent = `${chapterLikes} Likes`;
                })
                .catch(error => console.error("Error liking chapter:", error));
            } else {
                console.warn("No chapter is currently being viewed.");
            }
        });
    } else {
        console.error("Like chapter button or likes count element not found!");
    }
});

function loadBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = "";

    const token = localStorage.getItem('token');

    fetch("http://localhost:3000/api/books", {
        headers: {
            Authorization: `Bearer ${token}`
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
    })
    .then(books => {
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.coverImage}" alt="${book.title}" style="width: 100px;">
                <h3>${book.title}</h3>
                <div class="likes">Likes: <span id="book-likes-${book._id}">0</span></div>
                <button class="likes-button" onclick="likeBook('${book._id}')">Like</button>
                <button class="comments-button" onclick="openComments('${book._id}')">Comments</button>
                <button onclick="viewChapters('${book._id}')">Read Chapters</button>
                <div id="comments-${book._id}" class="comments-section" style="display: none; margin-top: 10px;">
                    <input type="text" id="comment-input-${book._id}" placeholder="Write a comment...">
                    <button onclick="addComment('${book._id}')">Post</button>
                    <div id="comments-list-${book._id}"></div>
                </div>
            `;

            bookList.appendChild(bookCard);
        });
    })
    .catch(error => console.error("Error fetching books:", error));
}

function likeBook(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}/like`, {
        method: "POST",
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to like book");
        return response.json();
    })
    .then(data => {
        const likeCountEl = document.getElementById(`book-likes-${bookId}`);
        likeCountEl.textContent = data.likes;
    })
    .catch(error => console.error("Error liking book:", error));
}

function openComments(bookId) {
    const commentSection = document.getElementById(`comments-${bookId}`);
    const isVisible = commentSection.style.display === "block";
    commentSection.style.display = isVisible ? "none" : "block";

    if (!isVisible) {
        fetch(`http://localhost:3000/api/books/${bookId}/comments`)
            .then(response => {
                if (!response.ok) throw new Error("Failed to fetch comments");
                return response.json();
            })
            .then(comments => {
                const commentsList = document.getElementById(`comments-list-${bookId}`);
                commentsList.innerHTML = comments.map(comment => `<p>${comment.text}</p>`).join("");
            })
            .catch(error => console.error("Error fetching comments:", error));
    }
}

function addComment(bookId) {
    const commentInput = document.getElementById(`comment-input-${bookId}`);
    const commentText = commentInput.value.trim();
    if (!commentText) return;

    fetch(`http://localhost:3000/api/books/${bookId}/comments`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: commentText }),
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to post comment");
        return response.json();
    })
    .then(data => {
        const commentsList = document.getElementById(`comments-list-${bookId}`);
        commentsList.innerHTML += `<p>${data.text}</p>`;
        commentInput.value = "";
    })
    .catch(error => console.error("Error adding comment:", error));
}

function viewChapters(bookId) {
    const chapterContainer = document.getElementById('chapter-display-area');
    const chapterContentArea = document.getElementById('chapter-content');
    const chapterLikesCount = document.getElementById('chapter-likes-count');

    chapterContentArea.innerHTML = '<p>Loading chapters...</p>';
    currentChapterId = null; // Reset current chapter ID when viewing a new book's chapters
    chapterLikes = 0;
    chapterLikesCount.textContent = '0 Likes'; // Reset chapter likes count

    fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch chapters");
            return response.json();
        })
        .then(chapters => {
            chapterContentArea.innerHTML = '';
            if (chapters && chapters.length > 0) {
                const firstChapter = chapters[0];
                currentChapterId = firstChapter._id;
                // We don't display initial likes here
                const chapterDiv = document.createElement("div");
                chapterDiv.classList.add("chapter-content");

                const chapterTitle = document.createElement("h2");
                chapterTitle.textContent = firstChapter.title;
                chapterDiv.appendChild(chapterTitle);

                const lines = firstChapter.content.split('\n');
                lines.forEach(line => {
                    const p = document.createElement('p');
                    p.textContent = line.trim();
                    chapterDiv.appendChild(p);
                });
                chapterContentArea.appendChild(chapterDiv);
                chapterContainer.classList.remove('hidden');
                chapterContainer.classList.add('show');
            } else {
                chapterContentArea.innerHTML = '<p>No chapters found for this book.</p>';
            }
        })
        .catch(error => {
            chapterContentArea.innerHTML = '<p>Error loading chapters.</p>';
            console.error("Error fetching chapters:", error);
        });
}