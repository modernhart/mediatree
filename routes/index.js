const express = require('express');
const router = express.Router();
const { youtubeToMedia, fileDownload, setCoverData, convertVideo } = require('../controllers/mediaController')
const upload = require("../lib/multer");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).json({success: true})
});
router.post('/audio/cover', upload.single('cover'), setCoverData)
router.post('/audio', youtubeToMedia)
router.post('/video', convertVideo)
router.get('/down/:filename', fileDownload)

module.exports = router;
