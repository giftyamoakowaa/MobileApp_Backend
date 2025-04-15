document.addEventListener('DOMContentLoaded', () => {
    fetch('http://localhost:3000/api/books')
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch books");
            return response.json();
        })
        .then(books => {
            const bookListContainer = document.getElementById('book-list');
            bookListContainer.innerHTML = '';

            books.forEach(book => {
                const bookCard = document.createElement('div');
                bookCard.classList.add('book-card');

                const titleElement = document.createElement('h3');
                titleElement.textContent = book.title;

                const likesElement = document.createElement('div');
                likesElement.classList.add('likes');
                likesElement.textContent = `Likes: ${book.likes}`;

                const buttonGroup = document.createElement('div');
                buttonGroup.classList.add('button-group');

                const likeButton = document.createElement('button');
                likeButton.classList.add('likes-button');
                likeButton.textContent = 'Like';
                // Add event listener for liking functionality

                const commentsButton = document.createElement('button');
                commentsButton.classList.add('comments-button');
                commentsButton.textContent = 'Comments';
                // Add event listener for comments functionality

                const readChaptersButton = document.createElement('button');
                readChaptersButton.classList.add('read-chapters-button');
                readChaptersButton.textContent = 'Read Chapters';
                readChaptersButton.onclick = () => viewChapters(book.id);

                buttonGroup.appendChild(likeButton);
                buttonGroup.appendChild(commentsButton);
                buttonGroup.appendChild(readChaptersButton);

                bookCard.appendChild(titleElement);
                bookCard.appendChild(likesElement);
                bookCard.appendChild(buttonGroup);

                bookListContainer.appendChild(bookCard);
            });
        })
        .catch(error => console.error("Error fetching books:", error));

    // Get the close icon and chapter container elements
    const closeChapterIcon = document.getElementById('close-chapter-icon');
    const chapterContainer = document.getElementById('chapter-container');
    const chapterContentArea = document.getElementById('chapter-content');

    // Add event listener to the close icon
    if (closeChapterIcon && chapterContainer && chapterContentArea) {
        closeChapterIcon.addEventListener('click', () => {
            chapterContainer.classList.remove('show');
            chapterContainer.classList.add('hidden');
            chapterContentArea.innerHTML = ''; // Clear the chapter content
        });
    } else {
        console.error("Close icon or chapter container or content area not found!");
    }
});

function viewChapters(bookId) {
    const chapterContainer = document.getElementById('chapter-container');
    const chapterContentArea = document.getElementById('chapter-content');
    chapterContentArea.innerHTML = '<p>Loading chapters...</p>'; // Indicate loading

    fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch chapters");
            return response.json();
        })
        .then(chapters => {
            chapterContentArea.innerHTML = ''; // Clear loading message
            chapters.forEach(chapter => {
                const chapterDiv = document.createElement("div");
                chapterDiv.classList.add("chapter-content");

                const chapterTitle = document.createElement("h2");
                chapterTitle.textContent = chapter.title;
                chapterDiv.appendChild(chapterTitle);

                const lines = chapter.content.split('\n');
                lines.forEach(line => {
                    const p = document.createElement('p');
                    p.textContent = line.trim();
                    chapterDiv.appendChild(p);
                });
                chapterContentArea.appendChild(chapterDiv);
            });
            chapterContainer.classList.remove('hidden');
            chapterContainer.classList.add('show'); // Use 'show' class to display
        })
        .catch(error => {
            chapterContentArea.innerHTML = '<p>Error loading chapters.</p>';
            console.error("Error fetching chapters:", error);
        });
}