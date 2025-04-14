document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
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
                <p>Likes: <span id="likes-${book._id}">${book.likes}</span></p>
                <button class="like-toggle-btn" data-id="${book._id}" data-liked="false">Like ❤️</button>
                <button onclick="openComments('${book._id}')">Comments</button>
                <button onclick="viewChapters('${book._id}')">Read Chapters</button>
                <div id="comments-${book._id}" class="comments-section" style="display: none; margin-top: 10px;">
                    <input type="text" id="comment-input-${book._id}" placeholder="Write a comment...">
                    <button onclick="addComment('${book._id}')">Post</button>
                    <div id="comments-list-${book._id}"></div>
                </div>
            `;

            bookList.appendChild(bookCard);

            const likeButton = bookCard.querySelector('.like-toggle-btn');
            likeButton.addEventListener('click', () => {
                const isLiked = likeButton.dataset.liked === "true";
                const bookId = likeButton.dataset.id;

                fetch(`http://localhost:3000/api/books/${bookId}/like`, {
                    method: "POST",
                })
                .then(response => {
                    if (!response.ok) throw new Error("Failed to like book");
                    return response.json();
                })
                .then(data => {
                    const likeCountEl = document.getElementById(`likes-${bookId}`);
                    likeCountEl.textContent = data.likes;

                    if (isLiked) {
                        likeButton.textContent = "Like ❤️";
                        likeButton.dataset.liked = "false";
                    } else {
                        likeButton.textContent = "Unlike 💔";
                        likeButton.dataset.liked = "true";
                    }
                })
                .catch(error => console.error("Error toggling like:", error));
            });
        });
    })
    .catch(error => console.error("Error fetching books:", error));
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
    fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch chapters");
            return response.json();
        })
        .then(chapters => {
            const chapterContainer = document.getElementById('chapter-container');
            chapterContainer.innerHTML = '';

            chapters.forEach(chapter => {
                const chapterDiv = document.createElement("div");
                chapterDiv.classList.add("chapter-content");

                const chapterTitle = document.createElement("h2");
                chapterTitle.textContent = chapter.title;
                chapterDiv.appendChild(chapterTitle);

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
                        chapterDiv.appendChild(dialogueParagraph);
                    } else if (line.trim() !== "") {
                        const narrativeParagraph = document.createElement('p');
                        narrativeParagraph.textContent = line.trim();
                        chapterDiv.appendChild(narrativeParagraph);
                    }
                });
                chapterContainer.appendChild(chapterDiv);
            });
        })
        .catch(error => console.error("Error fetching chapters:", error));
}
