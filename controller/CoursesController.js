const express = require('express');
const router = express.Router();
const Course = require('../Moudel/course');
const Video = require('../Moudel/video');
const auth = require('../MiddleWare/isAuthenticated');


router.post('/', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = new Course({ title, description, instructor: req.user._id });
    await course.save();
    res.status(201).json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء إنشاء الكورس' });
  }
});


router.get('/', async (req, res) => {
  try {
    const courses = await Course.find().populate('instructor').populate('videos');
    res.json(courses);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الكورسات' });
  }
});


router.get('/:courseId', async (req, res) => {
  try {
    const course = await Course.findById(req.params.courseId).populate('instructor').populate('videos');
    if (!course) {
      return res.status(404).json({ error: 'الكورس غير موجود' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الكورس' });
  }
});


router.put('/:courseId', auth, async (req, res) => {
  try {
    const { title, description } = req.body;
    const course = await Course.findByIdAndUpdate(
      req.params.courseId,
      { title, description },
      { new: true }
    );
    if (!course) {
      return res.status(404).json({ error: 'الكورس غير موجود' });
    }
    res.json(course);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء تعديل الكورس' });
  }
});


router.delete('/:courseId', auth, async (req, res) => {
  try {
    await Course.findByIdAndDelete(req.params.courseId);
    res.json({ message: 'تم حذف الكورس بنجاح' });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء حذف الكورس' });
  }
});

module.exports = router;