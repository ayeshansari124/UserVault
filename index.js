const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');

const app = express();
const port = 3000;

// Middleware
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Routes
app.get('/', (req, res) => {
  res.render('index', { title: 'Home Page' });
});

app.post('/create', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    await User.create({ name, email, image });
    res.redirect('/read');
  } catch (err) {
    res.status(500).send('Error creating user');
  }
});

app.get('/read', async (req, res) => {
  try {
    const users = await User.find();
    res.render('read', { users });
  } catch (err) {
    res.status(500).send('Error retrieving users');
  }
});

// ✅ FIXED: GET route for edit Form
app.get('/edit/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('edit', { user });
  } catch (err) {
    res.status(500).send('Error loading edit form');
  }
});

// ✅ POST route to handle actual edit
app.post('/edit/:id', async (req, res) => {
  try {
    const { name, email, image } = req.body;
    await User.findByIdAndUpdate(req.params.id, { name, email, image });
    res.redirect('/read');
  } catch (err) {
    res.status(500).send('Error updating user');
  }
});

// ✅ Delete route
app.get('/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/read');
  } catch (err) {
    res.status(500).send('Error deleting user');
  }
});

app.listen(port, () => console.log(`🚀 Server running at http://localhost:${port}`));
