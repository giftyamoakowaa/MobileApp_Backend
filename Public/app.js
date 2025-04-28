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
          readChaptersButton.onclick = () => viewChapters(book.id); //  Pass the book.id here
  
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
    fetch(`http://localhost:3000/api/books/${bookId}/chapters`)
      .then(response => {
        if (!response.ok) throw new Error("Failed to fetch chapters");
        return response.json();
      })
      .then(chapters => {
        const chapterContainer = document.getElementById('chapter-content');
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
  