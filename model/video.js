const mongoose = require("mongoose");

const videoSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    description: {
        type: String,
        required: true,
    },
    thumbnail: {
        type: String,
        required: true,
    },
    video: {
        type: String,
        required: true,

    },

});

const videoModel = mongoose.model("videoModel", videoSchema);
module.exports = videoModel;
