const express = require('express');
const router = express.Router();
const Course = require('../Moudel/course');
const user = require('../Moudel/user');
const auth = require('../MiddleWare/isAuthenticated');


router.post('/', auth, async (req, res) => {
    try {
        const { title, description, instructor, ...rest } = req.body;
        const newCourse = new Course({
            title,
            description,
            instructor,
            ...rest,
            createdAt: Date.now(),
            students: []
        });
        const savedCourse = await newCourse.save();
        res.status(201).json(savedCourse);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/', async (req, res) => {
    try {
        const courses = await Course.find().populate('instructor');
        res.json(courses);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:id', async (req, res) => {
    try {
        const course = await Course.findById(req.params.id).populate('instructor students');
        res.json(course);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.put('/:id', auth, async (req, res) => {
    try {
        const updatedCourse = await Course.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedCourse);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.delete('/:id', auth, async (req, res) => {
    try {
        await Course.findByIdAndDelete(req.params.id);
        res.json({ message: 'تم حذف الدورة بنجاح' });
    } catch (err) {
        res.status(500).json(err);
    }
});


router.post('/:courseId/enroll', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'not exsist' });
        }

        course.students.push(req.user._id);
        await course.save();

        res.json({ message: 'sucssesed' });
    } catch (err) {
        res.status(500).json(err);
    }
});

router.delete('/:courseId/enroll/:userId', auth, async (req, res) => {
    try {
        const course = await Course.findById(req.params.courseId);
        if (!course) {
            return res.status(404).json({ message: 'not exsist' });
        }

        course.students.pull(req.params.userId);
        await course.save();

        res.json({ message: 'unregiste' });
    } catch (err) {
        res.status(500).json(err);
    }
});

module.exports = router;