const router = require("express").Router();
const videoModel = require("../model/video");
const cloudinary = require('cloudinary').v2;

const CLOUD_NAME = process.env.CLOUD_NAME
const API_KEY = process.env.API_KEY
const API_SECRET = process.env.API_SECRET

// Configuration 
cloudinary.config({
    cloud_name: CLOUD_NAME,
    api_key: API_KEY,
    api_secret: API_SECRET
});

router.post("/upload", async (req, res) => {
    try {
        const { title, description } = req.body;
        const { image, video } = req.files;
        const result1 = await cloudinary.uploader.upload(image.tempFilePath)
        if (result1.url) {
            const result2 = await cloudinary.uploader.upload(video.tempFilePath,
                {
                    resource_type: "video",
                    public_id: "myfolder/mysubfolder/dog_closeup",
                    chunk_size: 6000000,
                    eager: [
                        { width: 300, height: 300, crop: "pad", audio_codec: "none" },
                        { width: 160, height: 100, crop: "crop", gravity: "south", audio_codec: "none" }],
                    eager_async: true,
                })

            if (result2.url) {
                const instanceObj = new videoModel({
                    title: title,
                    description: description,
                    thumbnail: result1.url,
                    video: result2.url,
                })
                await instanceObj.save();
                res.status(201).json({ message: "uploaded successfully!", success: true });

            }
        } else {
            res.status(404).json({ message: "file size large", success: false });
        }

    } catch (error) {
        console.log(error);
        res.status(404).json({ message: "uploading error!" });
    }
});


router.get("/getVideo", async (req, res) => {
    try {
        const videos = await videoModel.find()
        res.status(200).json({ data: videos, success: true })
    } catch (error) {
        res.status(404).json({ message: "videos error!", success: false });

    }
})
router.post("/getVideoById", async (req, res) => {
    try {
        const { id } = req.body
        const videos = await videoModel.findById(id)
        res.status(200).json({ data: videos, success: true })
    } catch (error) {
        res.status(404).json({ message: "videos error!", success: false });

    }
})


// admin routing
router.get("/", (req, res) => {
    res.status(200).json({ message: "server fine" });
});



module.exports = router;
