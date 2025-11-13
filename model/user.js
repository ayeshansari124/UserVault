const mongoose = require('mongoose');

mongoose.connect('mongodb://localhost:27017/userDatabase')
  .then(() => console.log("✅ MongoDB connected"))
  .catch(err => console.error("❌ MongoDB connection error:", err));

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  image: { type: String }
});

const User = mongoose.model('User', userSchema);
module.exports = User;
