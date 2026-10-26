import { useState, useEffect } from "react";
import { api } from "./api";
import Members from "./Members";

export default function Books({ onLogout }) {
  const [books, setBooks] = useState([]);
  const [title, setTitle] = useState("");
  const [author, setAuthor] = useState("");
  const [error, setError] = useState("");
  const [view, setView] = useState("all");

  async function loadBooks() {
    try {
      const data = await api("/books");
      setBooks(Array.isArray(data) ? data : []);
    } catch (err) {
      setError(err.message);
    }
  }

  useEffect(() => {
    loadBooks();
  }, []);

  async function run(path, method, body) {
    setError("");
    try {
      await api(path, method, body);
      loadBooks();
    } catch (err) {
      setError(err.message);
    }
  }

  async function addBook(e) {
    e.preventDefault();
    if (!title.trim() || !author.trim()) {
      setError("Enter both title and author");
      return;
    }
    await run("/books", "POST", { title, author });
    setTitle("");
    setAuthor("");
  }

  function editBook(book) {
    const newTitle = window.prompt("Book title", book.title);
    if (!newTitle || !newTitle.trim()) return;
    const newAuthor = window.prompt("Author", book.author);
    if (!newAuthor || !newAuthor.trim()) return;
    run("/books/" + book._id, "PUT", { title: newTitle, author: newAuthor });
  }

  function issueBook(book) {
    const name = window.prompt("Issue to which member?");
    if (!name || !name.trim()) return;
    run("/books/" + book._id + "/issue", "PUT", { issuedTo: name });
  }

  function returnBook(book) {
    run("/books/" + book._id + "/return", "PUT");
  }

  function deleteBook(book) {
    if (!window.confirm("Delete this book?")) return;
    run("/books/" + book._id, "DELETE");
  }

  const issuedBooks = books.filter((book) => book.issuedTo);
  const availableBooks = books.filter((book) => !book.issuedTo);

  return (
    <div className="box" style={{ maxWidth: 600 }}>
      <div className="top-row">
        <h2>Library</h2>
        <button onClick={onLogout}>Log out</button>
      </div>

      {error && <div className="error">{error}</div>}

      <div className="tabs">
        <button
          className={view === "all" ? "active" : ""}
          onClick={() => setView("all")}
        >
          All books ({books.length})
        </button>
        <button
          className={view === "available" ? "active" : ""}
          onClick={() => setView("available")}
        >
          Available ({availableBooks.length})
        </button>
        <button
          className={view === "issued" ? "active" : ""}
          onClick={() => setView("issued")}
        >
          Issued ({issuedBooks.length})
        </button>
                <button
          className={view === "members" ? "active" : ""}
          onClick={() => setView("members")}
        >
          Members
        </button>
      </div>

      {view === "all" && (
        <>
          <form onSubmit={addBook}>
            <input
              placeholder="Book title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
            <input
              placeholder="Author"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
            <button type="submit">Add book</button>
          </form>

          <h3>All books</h3>
          {books.length === 0 && <p>No books yet. Add one above.</p>}

          {books.map((book) => (
            <div className="task-row" key={book._id}>
              <div className="book-info">
                <strong>{book.title}</strong>
                <small>by {book.author}</small>
                {book.issuedTo ? (
                  <small className="status-issued">
                    Issued to {book.issuedTo}
                  </small>
                ) : (
                  <small className="status-ok">Available</small>
                )}
              </div>

              {book.issuedTo ? (
                <button onClick={() => returnBook(book)}>Return</button>
              ) : (
                <button onClick={() => issueBook(book)}>Issue</button>
              )}
              <button onClick={() => editBook(book)}>Edit</button>
              <button onClick={() => deleteBook(book)}>Delete</button>
            </div>
          ))}
        </>
      )}

      {view === "available" && (
        <>
          <h3>Books available in the library</h3>
          {availableBooks.length === 0 ? (
            <p>No books are available right now.</p>
          ) : (
            <table className="issued-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {availableBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>
                      <button onClick={() => issueBook(book)}>Issue</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}

      {view === "issued" && (
        <>
          <h3>Currently issued books</h3>
          {issuedBooks.length === 0 ? (
            <p>No books are issued right now.</p>
          ) : (
            <table className="issued-table">
              <thead>
                <tr>
                  <th>Book</th>
                  <th>Author</th>
                  <th>Issued to</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {issuedBooks.map((book) => (
                  <tr key={book._id}>
                    <td>{book.title}</td>
                    <td>{book.author}</td>
                    <td>{book.issuedTo}</td>
                    <td>
                      <button onClick={() => returnBook(book)}>Return</button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </>
      )}
      {view === "members" && <Members />}
    </div>
  );
}