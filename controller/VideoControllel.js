const express = require('express');
const router = express.Router();
const Video = require('../Moudel/video'); 
const Course = require('../Moudel/course');
const Comment = require('../Moudel/comment');
const auth = require('../MiddleWare/isAuthenticated'); 


router.post('/:courseId/videos', auth, async (req, res) => {
  try {
    const { title, description, videoUrl } = req.body;
    const courseId = req.params.courseId;

    const course = await Course.findById(courseId);
    if (!course) {
      return res.status(404).json({ error: 'الكورس غير موجود' });
    }

    const video = new Video({ title, description, videoUrl, course: courseId });
    await video.save();

    course.videos.push(video._id);
    await course.save();

    res.status(201).json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء إضافة الفيديو' });
  }
});

router.get('/:videoId', async (req, res) => {
  try {
    const video = await Video.findById(req.params.videoId)
      .populate('comments')
      .populate('course');

    if (!video) {
      return res.status(404).json({ error: 'الفيديو غير موجود' });
    }

    res.json(video);
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: 'حدث خطأ أثناء جلب الفيديو' });
  }
});

router.post('/:courseId/videos', auth, async (req, res) => {

  });
  

  router.get('/:videoId', async (req, res) => {
  
  });
  

  router.put('/:videoId', auth, async (req, res) => {
    try {
      const { title, description, videoUrl } = req.body;
      const video = await Video.findByIdAndUpdate(
        req.params.videoId,
        { title, description, videoUrl },
        { new: true }
      );
  
      if (!video) {
        return res.status(404).json({ error: 'الفيديو غير موجود' });
      }
  
      res.json(video);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدث خطأ أثناء تعديل الفيديو' });
    }
  });
  
 
  router.delete('/:videoId', auth, async (req, res) => {
    try {
      const video = await Video.findByIdAndDelete(req.params.videoId);
  
      if (!video) {
        return res.status(404).json({ error: 'الفيديو غير موجود' });
      }
  
      res.json({ message: 'تم حذف الفيديو بنجاح' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدث خطأ أثناء حذف الفيديو' });
    }
  });

  router.post('/:videoId/comments', auth, async (req, res) => {
    try {
      const { content } = req.body;
      const video = await Video.findById(req.params.videoId);
  
      if (!video) {
        return res.status(404).json({ error: 'الفيديو غير موجود' });
      }
  
      const comment = new Comment({ content, video: video._id, user: req.user._id });
      await comment.save();
  
      video.comments.push(comment._id);
      await video.save();
  
      res.status(201).json(comment);
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدث خطأ أثناء إضافة التعليق' });
    }
  });

  router.delete('/comments/:commentId', auth, async (req, res) => {
    try {
      const comment = await Comment.findByIdAndDelete(req.params.commentId);
  
      if (!comment) {
        return res.status(404).json({ error:   
   'التعليق غير موجود' });
      }
  
      res.json({ message: 'تم حذف التعليق بنجاح' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'حدث خطأ أثناء حذف التعليق' });
    }
});
module.exports = router;