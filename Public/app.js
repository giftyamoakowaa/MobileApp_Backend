// document.addEventListener('DOMContentLoaded', () => {
//     fetch('http://localhost:3000/api/books')
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
//     fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
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
  



//   let currentBookId = null; // Declare at the global scope
// let currentChapterIndex = 0; // Declare at the global scope
// let chapters = [];      // Declare at the global scope

// document.addEventListener('DOMContentLoaded', () => {
//   // ... (your existing DOMContentLoaded code)
// });

// function viewChapters(bookId) {
//   currentBookId = bookId;
//   currentChapterIndex = 0; // Initialize here
//   fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
//     .then(response => {
//       if (!response.ok) throw new Error("Failed to fetch chapters");
//       return response.json();
//     })
//     .then(data => {
//       chapters = data;
//       if (chapters.length > 0) {
//         displayChapter(currentChapterIndex);
//       }
//     })
//     .catch(error => console.error("Error fetching chapters:", error));
// }

// function displayChapter(index) {
//   // ... (your existing displayChapter code)
// }

// function nextChapter() {
//   if (currentChapterIndex < chapters.length - 1) {
//     currentChapterIndex++;
//     displayChapter(currentChapterIndex);
//   } else {
//     alert("You have reached the end of the book!");
//   }
// }

// function closeChapter() {
//   const chapterDisplayArea = document.getElementById('chapter-display-area');
//   if (chapterDisplayArea) {
//     chapterDisplayArea.classList.add('hidden');
//     chapterDisplayArea.innerHTML = '';
//   }
// }
  






let currentBookId = null;
let currentChapterIndex = 0;
let chapters = [];

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
        readChaptersButton.onclick = () => viewChapters(book._id);

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
  currentBookId = bookId;
  currentChapterIndex = 0; // Reset to 0 each time viewChapters is called.
  fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
    .then(response => {
      if (!response.ok) throw new Error("Failed to fetch chapters");
      return response.json();
    })
    .then(chaptersData => {
      chapters = chaptersData; // Store the chapters
      if (chapters.length > 0) {
        displayChapter(currentChapterIndex); // Display the first chapter
      } else {
        const chapterContainer = document.getElementById('chapter-content');
        chapterContainer.innerHTML = "<p>No chapters found for this book.</p>";
        document.getElementById('chapter-display-area').classList.remove('hidden');
      }
    })
    .catch(error => console.error("Error fetching chapters:", error));
}

function displayChapter(index) {
  const chapterContainer = document.getElementById('chapter-content');
  const chapterDisplayArea = document.getElementById('chapter-display-area');
  const nextButton = document.getElementById('next-chapter-button');


  chapterContainer.innerHTML = ''; // Clear previous content

  if (index >= 0 && index < chapters.length) {
    const chapter = chapters[index];

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
    chapterDisplayArea.classList.remove('hidden'); // Make sure the chapter display area is visible.

    if (index === chapters.length - 1) {
      nextButton.textContent = "End of Book";
      nextButton.onclick = () => {
        alert("You have reached the end of the book!");
        closeChapter();
      };
    } else {
      nextButton.textContent = "Next Chapter";
      nextButton.onclick = () => nextChapter();
    }
  }
  else
  {
        chapterContainer.innerHTML = "<p>No chapters to display.</p>";
        chapterDisplayArea.classList.remove('hidden');
  }
}

function nextChapter() {
  if (currentChapterIndex < chapters.length - 1) {
    currentChapterIndex++;
    displayChapter(currentChapterIndex);
  } else {
    alert("You have reached the end of the book!");
    closeChapter();
  }
}


function closeChapter() {
  const chapterDisplayArea = document.getElementById('chapter-display-area');
  if (chapterDisplayArea) {
    chapterDisplayArea.classList.add('hidden');
    chapterDisplayArea.innerHTML = '';
  }
}
