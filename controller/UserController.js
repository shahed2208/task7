const express = require('express');
const router = express.Router();
const User = require('../models/User');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
    try {
        const { name, email, password } = req.body;

        if (!name || !email || !password) {
            return res.status(400).json({ error: 'الرجاء ملء جميع الحقول' });
        }

        const existingUser = await User.findOne({ email });
        if (existingUser) {
            return res.status(409).json({ error: 'البريد الإلكتروني مستخدم بالفعل' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);

        const user = new User({ name, email, password: hashedPassword });
        await user.save();

        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.status(201).json({ message: 'تم تسجيل المستخدم بنجاح', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'حدث خطأ أثناء التسجيل' });
    }
});

router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

       
        const user = await User.findOne({ email });
        if (!user) {
            return res.status(404).json({ error: 'البريد الإلكتروني غير موجود' });
        }

        const isPasswordCorrect = await bcrypt.compare(password, user.password);
        if (!isPasswordCorrect) {
            return res.status(401).json({ error: 'كلمة المرور غير صحيحة' });
        }

 
        const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET);

        res.json({ message: 'تم تسجيل الدخول بنجاح', token });
    } catch (err) {
        console.error(err);
        res.status(500).json({ error: 'حدث خطأ أثناء تسجيل الدخول' });
    }
});

module.exports = router;