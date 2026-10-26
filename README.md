# Library Management System

A simple web app for managing a library: add books, issue them to members, take them back, and see who has an account. Built with the MERN stack (MongoDB, Express, React, Node.js).

## Features

- Register and log in (passwords are hashed, login uses a token)
- Add, edit and delete books
- Issue a book to a member and return it
- View all books, available books, and currently issued books
- View all registered members

## Tech stack

- **Frontend:** React (Vite)
- **Backend:** Node.js, Express 5
- **Database:** MongoDB Atlas with Mongoose
- **Security:** bcryptjs for passwords, JSON Web Tokens for login

## Folder structure

```
taskly/
  client/    React app (screens: login, books, members)
  server/    Express API (models, controllers, routes, middleware)
```

## How to run it

You need Node.js and a free MongoDB Atlas database.

### 1. Server

```
cd server
npm install
```

Create a file named `.env` inside the `server` folder with these lines (use your own values):

```
PORT=5001
MONGO_URI=your-mongodb-atlas-connection-string
JWT_SECRET=any-long-random-text
CLIENT_ORIGIN=http://localhost:5173
```

Then start the server:

```
npm run dev
```

You should see "MongoDB connected" and "API running on port 5001".

### 2. Client

In a second terminal:

```
cd client
npm install
npm run dev
```

Open http://localhost:5173 in your browser.

## API endpoints

| Method | Route | What it does |
|---|---|---|
| POST | /api/auth/register | Create an account |
| POST | /api/auth/login | Log in and get a token |
| GET | /api/auth/me | Get the logged-in user |
| GET | /api/books | List all books |
| POST | /api/books | Add a book |
| PUT | /api/books/:id | Edit a book |
| PUT | /api/books/:id/issue | Issue a book to a member |
| PUT | /api/books/:id/return | Return a book |
| DELETE | /api/books/:id | Delete a book |
| GET | /api/members | List all members |

Every route except register and login needs the login token.

## Notes

- Any logged-in user can manage books (there are no separate admin and member roles in this simple version).
- The `.env` file is private and is not uploaded to GitHub.