const express = require('express');
const app = express();
const mongoose = require('mongoose');
const bodyParser = require('body-parser');

mongoose.connect('mongodb://localhost:27017/todoDB');

const itemSchema = new mongoose.Schema({ task: String });
const Item = mongoose.model('Item', itemSchema);

app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.json()); // Needed for PUT and DELETE JSON body
app.set('view engine', 'ejs');
app.use(express.static("public"));

// Show tasks
app.get('/', async (req, res) => {
  const items = await Item.find();
  res.render('index', { listItems: items });
});

// Add task
app.post('/add', async (req, res) => {
  const item = new Item({ task: req.body.task });
  await item.save();
  res.redirect('/');
});

// PUT update
app.put('/edit/:id', async (req, res) => {
  await Item.findByIdAndUpdate(req.params.id, { task: req.body.task });
  res.json({ message: 'Updated' });
});

// DELETE
app.delete('/delete/:id', async (req, res) => {
  await Item.findByIdAndDelete(req.params.id);
  res.json({ message: 'Deleted' });
});

app.listen(3000, () => {
  console.log("Server running on http://localhost:3000");
});
