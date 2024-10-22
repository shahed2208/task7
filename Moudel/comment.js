const express = require('express');
const router = express.Router();
const Comment = require('../Moudel/comment');

router.post('/videos/:videoId/comments', isAuthenticated, async (req, res) => {
  try {
    const { text } = req.body;
    const videoId = req.params.videoId;
    const newComment = new Comment({ text, video: videoId, user: req.user._id });
    await newComment.save();

    const video = await Video.findById(videoId);
    video.comments.push(newComment._id);
    await video.save();

    res.status(201).json(newComment);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'حدث خطأ أثناء إضافة التعليق' });
  }
});