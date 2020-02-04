const bodyParser= require('body-parser');
const express = require('express');
const mongoose = require('mongoose');
const path = require('path');

const app = express();
const port = 3000;

//Set up default mongoose connection
const mongoDB = 'mongodb://127.0.0.1/grocery';
mongoose.connect(mongoDB, { useNewUrlParser: true });

//Get the default connection
const db = mongoose.connection;

//Bind connection to error event (to get notification of connection errors)
db.on('error', console.error.bind(console, 'MongoDB connection error:'));

// Define schema
const Schema = mongoose.Schema;

const ItemSchema = new Schema({
  name: String
});

// Compile model from schema
const Item = mongoose.model('Item', ItemSchema );

app.set('view engine', 'ejs');

app.use(express.static(path.join(__dirname, '/public/')));
app.use(bodyParser.urlencoded({extended: true}))

let items;

app.get('/', (req, res) => {
  db.collection('items').find().toArray((err, results) => {
    items = results.map(item => item.name);
  });

  res.render('index', { 
    heading: 'Grocery List',
    items: items
  });
});

app.post('/item', (req, res) => {
  // Save the new model instance, passing a callback
  Item.create({ name: req.body.name }, (err, itemInstance) => {
    if (err) {
      return handleError(err);
    }
    console.log('Response', itemInstance);
    res.redirect('/');
  });
});

app.listen(port, () => console.log(`App listening on port ${port}!`));