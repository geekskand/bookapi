const express = require('express');
const db = require('./db');
const { ObjectId } = require('mongodb');

// Initialize Express app
const app = express();

// Connect to the database
db.connectToDb()
  .then(() => {
    // Start server
    app.listen(4000, () => {
      console.log('Server running on port 4000');
    });
    app.use(express.json());

    // Define routes after the database connection is established
    app.get('/books', (req, res) => { 
        const page = req.query.p || 0
        const bookPerPage = 10  
      db.getDb().collection("bookdata").find().sort({ author: 1 }).toArray()
        .then((bookCollection) => res.status(200).json(bookCollection))
        .catch((error) => {
          console.error('Error retrieving books:', error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    });

    app.get('/books/:id', (req, res) => {
        const obId = new ObjectId(req.params.id)
      db.getDb().collection("bookdata").findOne({ _id: (obId) }).then(doc => {
          res.status(200).json(doc);
        })
        .catch((error) => {
          console.error('Error retrieving book:', error);
          res.status(500).json({ error: "Internal Server Error" });
        });
    });
    app.post("/books" , (req,res)=>{
        const book = req.body;
        console.log(book);
        db.getDb().collection("bookdata").insertOne(book).then(result =>{
            res.status(201).json({ message: "Submission successful", result })
        })
        .catch(err =>{
            console.error("nhi hua bhai", err);
            res.status(500).json({err: "nhi hua bhai"})
        })

    })
    app.delete("/books/:id" , (req,res)=>{
        const obId = new ObjectId(req.params.id)
      db.getDb().collection("bookdata").deleteOne({ _id: (obId) }).then(result => {
          res.status(200).json({ message: "Submission successful", result })
        })
        .catch(err =>{
            console.error("nhi hua bhai", err);
            res.status(500).json({err: "nhi hua bhai"})
        })
    })
  })
  .catch(err => {
    console.error('Failed to connect to database:', err);
    process.exit(1);
  });
