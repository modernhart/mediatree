const Downloader = require("../lib/downloader");
const NodeID3 = require('node-id3')
const path = require('path')

function youtubeToMedia(req, res, next) {
	const {link, title, album, fileName, artist, nameType, cover} = req.body
    let id = null
    
	if (link.includes('watch?v=')) {
		id = link.split('v=')[1]
	} else if (link.includes('youtu.be') || link.includes('embed')) {
		id = link.substr(link.lastIndexOf('/') + 1)
	}
	
	if (id === null) {
		res.status(400).json({success: false})
	} else {
		youtubePromise(id, (nameType === "custom") ? fileName : null)
		.then(data => {
			updateTag(data.file, req.body, cover)
			.then(result => {
				res.status(200).json({success: true, data})
			})
			.catch(err => {
				res.status(400).json({success: false})
			})	
		}).catch(err => {
			res.status(400).json({success: false})
		})	
	}
}

async function updateTag(filePath, tag, cover) {
	const filepath = filePath
	const {title, artist, album} = tag
	const tags = {}
	
	if (title) {
		tags['title'] = title
	}
	if (artist) {
		tags['artist'] = artist
	}
	if (album) {
		tags['album'] = album
	}
	if (cover) {
		tags['APIC'] = path.resolve('./upload', cover)
	}
	
	const success = await NodeID3.update(tags, filepath)
	return success
}

async function updateCover(filePath, cover) {
	const filepath = filePath
	const tags = {}
	tags['APIC'] = path.resolve('./upload', cover)
	
	const success = await NodeID3.update(tags, filepath)
	return success
}

function youtubePromise(videoId, fileName) {
	const dl = new Downloader(videoId);
	
	return new Promise(function(resolve, reject) {
		dl.extractAudio(fileName, function(err,res){
		  	// 데이터를 받으면 resolve() 호출
			if (err) {
				console.log(err)
				reject(new Error("Request is failed"));
			} else {
				resolve(res);
			}
		  
		});
	});
}


function setCoverData(req, res, next) {
	const {mediaPath} = req.body
	const cover = req.file.filename
	updateCover(mediaPath, cover)
	.then(result => {
		res.status(200).json({success: true})
	}).catch(err => {
		res.status(400).json({success: false})
	})
}

function fileDownload(req, res, next) {
	const {filename} = req.params
	const file = path.resolve('./mp3', filename)
	res.download(file)
}

module.exports = {
	youtubeToMedia,
	setCoverData,
	fileDownload,
	youtubePromise
}