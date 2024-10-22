
const express = require('express');
const router = express.Router();
const user = require('../Moudel/user');
const bcrypt = require('bcrypt'); 

router.post('/register', async (req, res) => {
  try {
    const { username, email, password } = req.body;

    const existingUser = await user.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'this email is already exsist' });
    }

   
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newuser = new user({
      username,
      email,
      password: hashedPassword
    });
    const userSchema = new mongoose.Schema({
        username: {
          type: String,
          required:   
       true,
          unique: true
        },
        email: {
          type: String,
          required: true,
          unique: true
        },
        password: {
          type: String,
          required: true
        },
        role: {
          type: String,
          enum: ['user', 'admin'],
          default: 'user'
        },
        createdAt: {
          type: Date,
          default:   
       Date.now
        }
      });
    await newuser.save();

    res.status(201).json({ message: 'sucssesd' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'something went wrong!' });
  }
});
router.post('/login', async (req, res) => {
    try {
      const { email, password } = req.body;
 
      const user = await user.findOne({ email });
      if (!user) {
        return res.status(404).json({ message: 'this email is not exsist' });
      }
  
      const isMatch = await bcrypt.compare(password, user.password);
      if (!isMatch) {
        return res.status(401).json({ message: 'your password is not correct' });
      }
  
      res.status(200).json({ message: 'sucssesed' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ message: 'something wromg jappend during register' });
    }
  });