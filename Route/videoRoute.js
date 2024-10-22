const express = require('express');
const router = express.Router();
const Video = require('../models/Video'); 
const multer = require('multer'); 
const path = require('path'); 

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/videos'); 
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname)); 
    }
});

const upload = multer({ storage: storage });


router.post('/', upload.single('video'), async (req, res) => {
    try {
        const newVideo = new Video({
            title: req.body.title,
            description: req.body.description,
            video: req.file.filename,
        });

        const savedVideo = await newVideo.save();
        res.status(201).json(savedVideo);
    } catch (err) {
        res.status(500).json(err);
    }
});

router.get('/', async (req, res) => {
    try {
        const videos = await Video.find();
        res.json(videos);
    } catch (err) {
        res.status(500).json(err);
    }
});


router.get('/:id', async (req, res) => {
    try {
        const video = await Video.findById(req.params.id);
        res.json(video);
    } catch (err) {
        res.status(500).json(err);
    }
});


module.exports = router;