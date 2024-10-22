const express = require('express');
const router = express.Router();
const Comment = require('../Moudel/comment'); 
const Video = require('../Moudel/video');  
const auth = require('../MiddleWare/isAutenticated'); 

router.post('/', auth, async (req, res) => {
    try {
        const { content } = req.body;
        const video = await Video.findById(req.body.videoId);
        if (!video) {
            return res.status(404).json({ message: 'NOT EXSIST' });
        }

        const newComment = new Comment({
            content,
            user: req.user.id, 
            video: video._id
        });

        const savedComment = await newComment.save();
        video.comments.push(savedComment._id);
        await video.save();

        res.status(201).json(savedComment);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/:videoId', async (req, res) => {
    try {
        const comments = await Comment.find({ video: req.params.videoId });
        res.json(comments);
    } catch (err) {
        res.status(500).json(err);
    }
});



module.exports = router;