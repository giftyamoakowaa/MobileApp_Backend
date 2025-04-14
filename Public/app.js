document.addEventListener("DOMContentLoaded", () => {
    loadBooks();
});

// Load all books from the backend
// Load all books from the backend
function loadBooks() {
    const bookList = document.getElementById("book-list");
    bookList.innerHTML = ""; // Clear existing content

    const token = localStorage.getItem('token'); // Get the token from localStorage

    fetch("http://localhost:3000/api/books", {
        headers: {
            Authorization: `Bearer ${token}` // Add the Authorization header
        }
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to fetch books");
        return response.json();
    })
    .then(books => {
        console.log(books); // This will log the fetched books to the console
        books.forEach(book => {
            const bookCard = document.createElement("div");
            bookCard.classList.add("book-card");

            bookCard.innerHTML = `
                <img src="${book.coverImage}" alt="${book.title}" style="width: 100px;">
                <h3>${book.title}</h3>
                <p>Likes: <span id="likes-${book._id}">${book.likes}</span></p>
                <button onclick="likeBook('${book._id}')">Like</button>
                <button onclick="openComments('${book._id}')">Comments</button>
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


// Like a book
function likeBook(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}/like`, {
        method: "POST",
    })
    .then(response => {
        if (!response.ok) throw new Error("Failed to like book");
        return response.json();
    })
    .then(data => {
        document.getElementById(`likes-${bookId}`).innerText = data.likes;
    })
    .catch(error => console.error("Error liking book:", error));
}

// Show/hide and load comments
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

// Post a comment
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

// Placeholder for Read Chapters
function viewChapters(bookId) {
    fetch(`http://localhost:3000/api/books/${bookId}/chapters`) // Make a GET request
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch chapters");
            return response.json();
        })
        .then(chapters => {
            // Display chapters on the page
            const chaptersContainer = document.createElement("div"); // Use a container for all chapters
            chapters.forEach(chapter => {
                const chapterDiv = document.createElement("div");
                chapterDiv.classList.add("chapter-content"); // Apply the chapter-content class

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
                        // Handle narrative lines (non-dialogue)
                        const narrativeParagraph = document.createElement('p');
                        narrativeParagraph.textContent = line.trim();
                        chapterDiv.appendChild(narrativeParagraph);
                    }
                });
                chaptersContainer.appendChild(chapterDiv); // Add each chapter to the container
            });
            document.body.appendChild(chaptersContainer); // Append the container to the body (adjust as needed)
        })
        .catch(error => console.error("Error fetching chapters:", error));
}

// You'll need to call this function with the appropriate bookId, for example:
// viewChapters(123);
// document.addEventListener("DOMContentLoaded", () => {
//     loadBooks();
// });

// // Simplified loadBooks function for debugging
// function loadBooks() {
//     const bookList = document.createElement("div");
//     bookList.id = "book-list";
//     document.querySelector("main").appendChild(bookList);
//     console.log("book-list created");
// }

// // Like a book
// function likeBook(bookId) {
//     fetch(`http://localhost:3000/api/books/${bookId}/like`, {
//         method: "POST",
//     })
//     .then(response => {
//         if (!response.ok) throw new Error("Failed to like book");
//         return response.json();
//     })
//     .then(data => {
//         document.getElementById(`likes-${bookId}`).innerText = data.likes;
//     })
//     .catch(error => console.error("Error liking book:", error));
// }

// // Show/hide and load comments
// function openComments(bookId) {
//     const commentSection = document.getElementById(`comments-${bookId}`);
//     const isVisible = commentSection.style.display === "block";
//     commentSection.style.display = isVisible ? "none" : "block";

//     if (!isVisible) {
//         fetch(`http://localhost:3000/api/books/${bookId}/comments`)
//             .then(response => {
//                 if (!response.ok) throw new Error("Failed to fetch comments");
//                 return response.json();
//             })
//             .then(comments => {
//                 const commentsList = document.getElementById(`comments-list-${bookId}`);
//                 commentsList.innerHTML = comments.map(comment => `<p>${comment.text}</p>`).join("");
//             })
//             .catch(error => console.error("Error fetching comments:", error));
//     }
// }

// // Post a comment
// function addComment(bookId) {
//     const commentInput = document.getElementById(`comment-input-${bookId}`);
//     const commentText = commentInput.value.trim();

//     if (!commentText) return;

//     fetch(`http://localhost:3000/api/books/${bookId}/comments`, {
//         method: "POST",
//         headers: { "Content-Type": "application/json" },
//         body: JSON.stringify({ text: commentText }),
//     })
//     .then(response => {
//         if (!response.ok) throw new Error("Failed to post comment");
//         return response.json();
//     })
//     .then(data => {
//         const commentsList = document.getElementById(`comments-list-${bookId}`);
//         commentsList.innerHTML += `<p>${data.text}</p>`;
//         commentInput.value = "";
//     })
//     .catch(error => console.error("Error adding comment:", error));
// }

// // Placeholder for Read Chapters
// function viewChapters(bookId) {
//     alert(`Chapters for book ID: ${bookId}`);
// }