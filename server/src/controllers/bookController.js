import Book from "../models/Book.js";

export async function listBooks(req, res) {
  const books = await Book.find().sort({ createdAt: -1 });
  res.json(books);
}

export async function createBook(req, res) {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }
  const book = await Book.create({ title, author });
  res.status(201).json(book);
}

export async function updateBook(req, res) {
  const { title, author } = req.body;
  if (!title || !author) {
    return res.status(400).json({ message: "Title and author are required" });
  }
  const book = await Book.findByIdAndUpdate(
    req.params.id,
    { title, author },
    { returnDocument: "after" }
  );
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json(book);
}

export async function issueBook(req, res) {
  const { issuedTo } = req.body;
  if (!issuedTo || !issuedTo.trim()) {
    return res.status(400).json({ message: "Enter the member name" });
  }
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  if (book.issuedTo) {
    return res.status(400).json({ message: "Book is already issued" });
  }
  book.issuedTo = issuedTo.trim();
  await book.save();
  res.json(book);
}

export async function returnBook(req, res) {
  const book = await Book.findById(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  book.issuedTo = "";
  await book.save();
  res.json(book);
}

export async function deleteBook(req, res) {
  const book = await Book.findByIdAndDelete(req.params.id);
  if (!book) {
    return res.status(404).json({ message: "Book not found" });
  }
  res.json({ message: "Book deleted" });
}