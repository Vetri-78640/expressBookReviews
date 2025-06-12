const express = require('express');
const axios = require('axios');
let books = require("./booksdb.js");
const async_router = express.Router();

// Get all books using async callback function
async_router.get('/async', async function (req, res) {
    try {
        const booksList = await new Promise((resolve, reject) => {
            setTimeout(() => {
                resolve(books);
            }, 1000);
        });
        return res.status(200).json(booksList);
    } catch (error) {
        return res.status(500).json({ message: "Error fetching books" });
    }
});

// Search by ISBN using Promises
async_router.get('/async/isbn/:isbn', function (req, res) {
    const isbn = req.params.isbn;
    
    new Promise((resolve, reject) => {
        setTimeout(() => {
            if (books[isbn]) {
                resolve(books[isbn]);
            } else {
                reject(new Error("Book not found"));
            }
        }, 1000);
    })
    .then(book => res.status(200).json(book))
    .catch(error => res.status(404).json({ message: error.message }));
});

// Search by Author using async/await
async_router.get('/async/author/:author', async function (req, res) {
    try {
        const author = req.params.author;
        const booksByAuthor = {};
        
        await new Promise((resolve) => {
            setTimeout(() => {
                for (let isbn in books) {
                    if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
                        booksByAuthor[isbn] = books[isbn];
                    }
                }
                resolve();
            }, 1000);
        });

        if (Object.keys(booksByAuthor).length > 0) {
            return res.status(200).json(booksByAuthor);
        }
        return res.status(404).json({ message: "No books found by this author" });
    } catch (error) {
        return res.status(500).json({ message: "Error searching books by author" });
    }
});

// Search by Title using async/await
async_router.get('/async/title/:title', async function (req, res) {
    try {
        const title = req.params.title;
        const booksByTitle = {};
        
        await new Promise((resolve) => {
            setTimeout(() => {
                for (let isbn in books) {
                    if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
                        booksByTitle[isbn] = books[isbn];
                    }
                }
                resolve();
            }, 1000);
        });

        if (Object.keys(booksByTitle).length > 0) {
            return res.status(200).json(booksByTitle);
        }
        return res.status(404).json({ message: "No books found with this title" });
    } catch (error) {
        return res.status(500).json({ message: "Error searching books by title" });
    }
});

module.exports = async_router; 