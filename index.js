// server.js
const express = require('express');
const path = require('path');
const mongoose = require('mongoose');
const User = require('./model/user');

const app = express();
const PORT = 3000;

// View engine setup
app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));

// Home route
app.get('/', (_, res) => res.render('index', { title: 'Home Page' }));

// Create user
app.post('/create', async (req, res) => {
  try {
    await User.create(req.body);
    res.redirect('/read');
  } catch {
    res.status(500).send('Error creating user');
  }
});

// Read all users
app.get('/read', async (_, res) => {
  try {
    const users = await User.find();
    res.render('read', { users });
  } catch {
    res.status(500).send('Error retrieving users');
  }
});

// Edit user (form)
app.get('/edit/:id', async (req, res) => {
  try {
    const user = await User.findById(req.params.id);
    if (!user) return res.status(404).send('User not found');
    res.render('edit', { user });
  } catch {
    res.status(500).send('Error loading edit form');
  }
});

// Update user (submit)
app.post('/edit/:id', async (req, res) => {
  try {
    await User.findByIdAndUpdate(req.params.id, req.body);
    res.redirect('/read');
  } catch {
    res.status(500).send('Error updating user');
  }
});

// Delete user
app.get('/delete/:id', async (req, res) => {
  try {
    await User.findByIdAndDelete(req.params.id);
    res.redirect('/read');
  } catch {
    res.status(500).send('Error deleting user');
  }
});

// Start server
app.listen(PORT, () => console.log(`🚀 Server running on http://localhost:${PORT}`));
