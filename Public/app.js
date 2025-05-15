// document.addEventListener('DOMContentLoaded', () => {
//     fetch('https://mobileapp-backend-1.onrender.com/api/books')
//       .then(response => {
//         if (!response.ok) throw new Error("Failed to fetch books");
//         return response.json();
//       })
//       .then(books => {
//         const bookListContainer = document.getElementById('book-list');
//         bookListContainer.innerHTML = '';
  
//         books.forEach(book => {
//           const bookCard = document.createElement('div');
//           bookCard.classList.add('book-card');

//          // Create and add the image element
//          const coverImage = document.createElement('img');
//          coverImage.src = book.coverImage; // Set the src attribute
//          coverImage.alt = book.title;       // Add an alt attribute (important for accessibility)
//          bookCard.appendChild(coverImage);    // Append the image to the bookCard



  
//           const titleElement = document.createElement('h3');
//           titleElement.textContent = book.title;
  
//           const likesElement = document.createElement('div');
//           likesElement.classList.add('likes');
//           likesElement.textContent = `Likes: ${book.likes}`;
  
//           const buttonGroup = document.createElement('div');
//           buttonGroup.classList.add('button-group');
  
//           const likeButton = document.createElement('button');
//           likeButton.classList.add('likes-button');
//           likeButton.textContent = 'Like';
//           // Add event listener for liking functionality
  
//           const commentsButton = document.createElement('button');
//           commentsButton.classList.add('comments-button');
//           commentsButton.textContent = 'Comments';
//           // Add event listener for comments functionality
  
//           const readChaptersButton = document.createElement('button');
//           readChaptersButton.classList.add('read-chapters-button');
//           readChaptersButton.textContent = 'Read Chapters';
//           readChaptersButton.onclick = () => viewChapters(book._id); // Use book._id here
  
//           buttonGroup.appendChild(likeButton);
//           buttonGroup.appendChild(commentsButton);
//           buttonGroup.appendChild(readChaptersButton);
  
//           bookCard.appendChild(titleElement);
//           bookCard.appendChild(likesElement);
//           bookCard.appendChild(buttonGroup);
  
//           bookListContainer.appendChild(bookCard);
//         });
//       })
//       .catch(error => console.error("Error fetching books:", error));
//   });
  
//   function viewChapters(bookId) {
//     fetch(`https://mobileapp-backend-1.onrender.com/api/books/${bookId}/chapters`)
//       .then(response => {
//         if (!response.ok) throw new Error("Failed to fetch chapters");
//         return response.json();
//       })
//       .then(chapters => {
//         const chapterContainer = document.getElementById('chapter-content');
//         chapterContainer.innerHTML = '';
  
//         chapters.forEach(chapter => {
//           const chapterDiv = document.createElement("div");
//           chapterDiv.classList.add("chapter-content");
  
//           const chapterTitle = document.createElement("h2");
//           chapterTitle.textContent = chapter.title;
//           chapterDiv.appendChild(chapterTitle);
  
//           const lines = chapter.content.split('\n');
//           lines.forEach(line => {
//             if (line.includes(':')) {
//               const [speaker, ...textParts] = line.split(':');
//               const text = textParts.join(':').trim();
  
//               const dialogueParagraph = document.createElement('p');
//               dialogueParagraph.classList.add('dialogue');
  
//               const speakerSpan = document.createElement('span');
//               speakerSpan.classList.add('speaker');
//               speakerSpan.textContent = speaker.trim() + ':';
  
//               const lineSpan = document.createElement('span');
//               lineSpan.classList.add('line');
//               lineSpan.textContent = text;
  
//               dialogueParagraph.appendChild(speakerSpan);
//               dialogueParagraph.appendChild(lineSpan);
//               chapterDiv.appendChild(dialogueParagraph);
//             } else if (line.trim() !== "") {
//               const narrativeParagraph = document.createElement('p');
//               narrativeParagraph.textContent = line.trim();
//               chapterDiv.appendChild(narrativeParagraph);
//             }
//           });
//           chapterContainer.appendChild(chapterDiv);
//         });
//       })
//       .catch(error => console.error("Error fetching chapters:", error));
//   }
  


  

// if ('serviceWorker' in navigator) {
//   window.addEventListener('load', () => {
//     navigator.serviceWorker.register('/service-worker.js').then((registration) => {
//       console.log('Service Worker registered with success:', registration);
//     }).catch((error) => {
//       console.log('Service Worker registration failed:', error);
//     });
//   });
// }




document.addEventListener('DOMContentLoaded', () => {
    fetch('https://mobileapp-backend-1.onrender.com/api/books')
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

                // Create and add the image element
                const coverImage = document.createElement('img');
                coverImage.src = book.coverImage;
                coverImage.alt = book.title;
                bookCard.appendChild(coverImage);

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
                readChaptersButton.onclick = () => {
                    viewChapters(book._id);
                };

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
});

function viewChapters(bookId) {
    fetch(`https://mobileapp-backend-1.onrender.com/api/books/${bookId}/chapters`)
        .then(response => {
            if (!response.ok) throw new Error("Failed to fetch chapters");
            return response.json();
        })
        .then(chapters => {
            displayChaptersInStories(chapters, bookId);
        })
        .catch(error => console.error("Error fetching chapters:", error));
}

function displayChaptersInStories(chapters, bookId) {
    const chapterDisplayArea = document.getElementById('chapter-display-area');
    const chapterContentDiv = document.getElementById('chapter-content');
    const chapterTitleElement = document.getElementById('chapter-title');
    const chapterTextElement = document.getElementById('chapter-text');
    const nextChapterButton = document.getElementById('next-chapter-button');
    const prevChapterButton = document.getElementById('prev-chapter-button'); // Get the previous button
    const closeChapterButton = document.getElementById('close-chapter-button');

    let currentBookId = null;
    let currentChapterIndex = 0;

    chapterDisplayArea.classList.remove('hidden');
    chapterContentDiv.innerHTML = '';
    currentBookId = bookId;
    window.chapters = chapters;

    if (chapters && chapters.length > 0) {
        loadChapter(chapters[0]);
    }
    else{
        chapterTextElement.innerHTML = "<p>No chapters found for this book.</p>";
        chapterDisplayArea.classList.remove('hidden');
        nextChapterButton.style.display = 'none';
        prevChapterButton.style.display = 'none';
    }


    /**
     * Loads and displays a chapter's content.
     * @param {object} chapter - The chapter object from your API.
     */
    function loadChapter(chapter) {
        if (!chapter) {
            chapterTextElement.innerHTML = "<p>Chapter not found.</p>";
            nextChapterButton.style.display = 'none';
            prevChapterButton.style.display = 'none'; // Hide previous button
            return;
        }

        currentChapterIndex = chapter.chapterNumber - 1;
        chapterTitleElement.textContent =  chapter.title ;
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

        chapterDisplayArea.classList.remove('hidden');
        updateNavButtons(); // Use this function.
    }

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
            nextChapterButton.onclick = () => closeChapter();
        }
    }

    function closeChapter() {
        chapterDisplayArea.classList.add('hidden');
        currentChapterIndex = 0;
        currentBookId = null;
    }
}
