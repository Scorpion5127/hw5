const express = require('express');
const app = express();
const { MongoClient } = require('mongodb');
const bodyParser = require('body-parser');
const connectionString = "mongodb+srv://itsame3000:TFKxWjh2zqF7aZaw@cluster0.bmudppa.mongodb.net/?retryWrites=true&w=majority";

MongoClient.connect(connectionString, { useUnifiedTopology: true })
  .then(client => {
    console.log('Connected to Database');
    const db = client.db('pract_db');
    const quotesCollection = db.collection('star-wars-quotes');
    app.set('view engine', 'ejs');
    app.use(express.static('public'))
    app.use(bodyParser.json());
    app.use(express.json()); // Middleware for parsing JSON data
    app.use(express.urlencoded({ extended: true })); // Middleware for parsing URL-encoded data

    app.post('/quotes', (req, res) => {
      console.log(req.body);
      quotesCollection
        .insertOne(req.body)
        .then(result => {
          res.redirect('/');
        })
        .catch(error => console.error(error));
    });

    app.get('/', (req, res) => {
      db.collection('star-wars-quotes')
        .find()
        .toArray()
        .then(results => {
          res.render('index.ejs', { quotes: results });
        })
        .catch(error => console.error(error));
    });

    app.put('/quotes', (req, res) => {
      quotesCollection
        .findOneAndUpdate(
          { name: 'Yoda' },
          {
            $set: {
              name: req.body.name,
              quote: req.body.quote,
            },
          },
          {
            upsert: true,
          }
        )
        .then(result => {
          res.json('Success---------------------');
          //console.log(result);
        })
        .catch(error => console.error(error));
    });
    app.delete('/quotes', (req, res) => {
      quotesCollection
        .deleteOne({ name: req.body.name })
        .then(result => {
          if (result.deletedCount === 0) {
            return res.json('No quote to delete')
          }
          res.json(`Deleted Darth Vader's quote`)
        })
        .catch(error => console.error(error))
    })
    const port = process.env.PORT || 3000;
    app.listen(port, () => {
      console.log(`Server running on port ${port}`);
    });
  })
  .catch(error => {
    console.error('Error connecting to the database:', error);
  });