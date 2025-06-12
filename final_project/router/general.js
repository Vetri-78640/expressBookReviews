const express = require('express');
let books = require("./booksdb.js");
let isValid = require("./auth_users.js").isValid;
let users = require("./auth_users.js").users;
const public_users = express.Router();

public_users.post("/register", (req,res) => {
    const username = req.body.username;
    const password = req.body.password;
  
    if (username && password) {
        if (!isValid(username)) { 
            users.push({"username":username,"password":password});
            return res.status(200).json({message: "User successfully registred. Now you can login"});
        } else {
            return res.status(404).json({message: "User already exists!"});    
        }
    } 
    return res.status(404).json({message: "Unable to register user."});
});

// Get the book list available in the shop
public_users.get('/',function (req, res) {
    return res.status(200).json(books);
});

// Get book details based on ISBN
public_users.get('/isbn/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn]) {
        return res.status(200).json(books[isbn]);
    }
    return res.status(404).json({message: "Book not found"});
});
  
// Get book details based on author
public_users.get('/author/:author',function (req, res) {
    const author = req.params.author;
    const booksByAuthor = {};
    
    for (let isbn in books) {
        if (books[isbn].author.toLowerCase() === author.toLowerCase()) {
            booksByAuthor[isbn] = books[isbn];
        }
    }
    
    if (Object.keys(booksByAuthor).length > 0) {
        return res.status(200).json(booksByAuthor);
    }
    return res.status(404).json({message: "No books found by this author"});
});

// Get all books based on title
public_users.get('/title/:title',function (req, res) {
    const title = req.params.title;
    const booksByTitle = {};
    
    for (let isbn in books) {
        if (books[isbn].title.toLowerCase().includes(title.toLowerCase())) {
            booksByTitle[isbn] = books[isbn];
        }
    }
    
    if (Object.keys(booksByTitle).length > 0) {
        return res.status(200).json(booksByTitle);
    }
    return res.status(404).json({message: "No books found with this title"});
});

//  Get book review
public_users.get('/review/:isbn',function (req, res) {
    const isbn = req.params.isbn;
    if (books[isbn] && books[isbn].reviews) {
        return res.status(200).json(books[isbn].reviews);
    }
    return res.status(404).json({message: "No reviews found for this book"});
});

module.exports.general = public_users;
