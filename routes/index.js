const express = require('express');
const router = express.Router();
const { youtubeToMedia, fileDownload, setCoverData } = require('../controllers/mediaController')
const upload = require("../lib/multer");

/* GET home page. */
router.get('/', function(req, res, next) {
	res.status(200).json({success: true})
});
router.post('/video/cover', upload.single('cover'), setCoverData)
router.post('/video', youtubeToMedia)
router.get('/down/:filename', fileDownload)

module.exports = router;
