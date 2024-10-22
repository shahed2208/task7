const express = require('express');
const router = express.Router();
const User = require('../models/User'); 
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken'); 

router.post('/signup', async (req, res) => {
    try {
        const { username, email, password } = req.body;

      
        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(400).json({ message: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);


        const user = new User({
            username,
            email,
            password: hashedPassword
        });

        await user.save();


        const token = jwt.sign({ userId: user._id }, 'your_secret_key', { expiresIn: '1h' });

        res.status(201).json({ message: 'تم إنشاء الحساب بنجاح', user, token });
    } catch (err) {
        res.status(400).json({ message: err.message });
    }
});

router.post('/login', async (req, res) => {

});

router.get('/:id', async (req, res) => {
    try {
        const user = await User.findById(req.params.id);
        res.json(user);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});



module.exports = router;