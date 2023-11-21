document.addEventListener("DOMContentLoaded", function () {
    (function () {
        function AllBooks() {
            const books = [];
            for (let i = 0; i < localStorage.length; i++) {
                const key = localStorage.key(i);
                if (key.startsWith("book-")) {
                    const bookJSON = localStorage.getItem(key);
                    const book = JSON.parse(bookJSON);
                    books.push(book);
                }
            }
            return books;
        }

        function updateBooks(books) {
            const { incompleteBookshelf, completeBookshelf } = elements;
            incompleteBookshelf.innerHTML = "";
            completeBookshelf.innerHTML = "";

            books.forEach((book) => {
                const bookTitle = document.createElement("article");
                bookTitle.classList.add("book_item");
                const h3 = document.createElement("h3");
                h3.innerText = book.title;
                const titleAuthor = document.createElement("p");
                titleAuthor.innerText = `Penulis: ${book.author}`;
                const titleYear = document.createElement("p");
                titleYear.innerText = `Tahun: ${book.year}`;
                const actionDiv = document.createElement("div");
                actionDiv.classList.add("action");


                const deleteButton = document.createElement("button");
                deleteButton.innerText = "Hapus buku";
                deleteButton.classList.add("red");
                deleteButton.setAttribute("data-book-id", book.id);

                deleteButton.addEventListener("click", function () {
                    const bookId = this.getAttribute("data-book-id");
                    const confirmDelete = confirm(
                        "Apakah Anda yakin ingin menghapus buku ini?"
                    );
                    if (confirmDelete) {
                        deleteBook(bookId);
                    }
                });

                const unfinishedButton = document.createElement("button");
                unfinishedButton.innerText = "Belum selesai di Baca";
                unfinishedButton.classList.add("green");
                unfinishedButton.setAttribute("data-book-id", book.id);
                unfinishedButton.addEventListener("click", function () {
                    bookComplete(book.id);
                });
                const finishedButton = document.createElement("button");
                finishedButton.innerText = "Selesai dibaca";
                finishedButton.classList.add("green");
                finishedButton.setAttribute("data-book-id", book.id);
                finishedButton.addEventListener("click", function () {
                    bookComplete(book.id);
                });

                if (book.isComplete) {
                    actionDiv.appendChild(unfinishedButton);
                    completeBookshelf.appendChild(bookTitle);
                } else {
                    actionDiv.appendChild(finishedButton);
                    incompleteBookshelf.appendChild(bookTitle);
                }

                actionDiv.appendChild(deleteButton);
                bookTitle.appendChild(h3);
                bookTitle.appendChild(titleAuthor);
                bookTitle.appendChild(titleYear);
                bookTitle.appendChild(actionDiv);
            });
        }

        function searchBooks(query) {
            const books = AllBooks();
            const matchingBooks = books.filter((book) =>
                book.title.toLowerCase().includes(query.toLowerCase())
            );
            updateBooks(matchingBooks);
        }

        function bookComplete(bookId) {
            const bookJSON = localStorage.getItem(bookId);
            const book = JSON.parse(bookJSON);

            book.isComplete = !book.isComplete;

            localStorage.setItem(bookId, JSON.stringify(book));

            updateBooks(AllBooks());
        }

        function deleteBook(bookId) {
            localStorage.removeItem(bookId);
            updateBooks(AllBooks());
        }

        const elements = {
            form: document.getElementById("inputBook"),
            textTitle: document.getElementById("inputBookTitle"),
            textAuthor: document.getElementById("inputBookAuthor"),
            textYear: document.getElementById("inputBookYear"),
            isCompleteInput: document.getElementById("inputBookIsComplete"),
            searchForm: document.getElementById("searchBook"),
            searchInput: document.getElementById("searchBookTitle"),
            incompleteBookshelf: document.getElementById("incompleteBookshelfList"),
            completeBookshelf: document.getElementById("completeBookshelfList"),
        };

        updateBooks(AllBooks());

        elements.searchForm.addEventListener("submit", function (event) {
            event.preventDefault();
            const query = elements.searchInput.value;
            searchBooks(query);
        });

        const form = elements.form;
        const textTitle = elements.textTitle;
        const textAuthor = elements.textAuthor;
        const textYear = elements.textYear;
        const isCompleteInput = elements.isCompleteInput;

        form.addEventListener("submit", function (event) {
            event.preventDefault();

            const title = textTitle.value;
            const author = textAuthor.value;
            const year = textYear.value;
            const isComplete = isCompleteInput.checked;

            const timestamp = Date.now();

            const book = {
                id: `book-${timestamp}`,
                title: title,
                author: author,
                year: Number(year),
                isComplete: isComplete,
            };

            const bookJSON = JSON.stringify(book);

            localStorage.setItem(`book-${timestamp}`, bookJSON);

            textTitle.value = "";
            textAuthor.value = "";
            textYear.value = "";
            isCompleteInput.checked = false;

            updateBooks(AllBooks());
        });
    })();
});