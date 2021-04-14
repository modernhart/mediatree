const fs = require('fs')
const youtubedl = require('youtube-dl')
const path = require('path')

const generateVideo = async (link, fileName) => {
	let videoInfo;
	// Optional arguments passed to youtube-dl.
	// ['--format=18'],
	// // Additional options can be given for calling `child_process.execFile()`.
	// { cwd: __dirname })
	return new Promise(async (resolve, reject) => {
		try {
			videoInfo = await getYoutubeInfo(link)
		}
		catch (err) {
			reject(err)
			return
		}
		
		if (!videoInfo) {
			throw new Error(`Unable to get video info from url ${link}`)
		}
		let filename = (fileName)? fileName + '.mp4' : videoInfo._filename + '.mp4';
		const video = youtubedl(link);
		
		video.on('info', (info) => {
			const {size, _filename} = info
			let output = path.join("/app/medias" + '/', filename)
			video.pipe(fs.createWriteStream(output))
		})
		
		video.on('end', async () => {
			//process.stdout.write(' - DONE\n');
			resolve({ file: filename})
		})
	})
}

const getYoutubeInfo = (link) => {
	return new Promise((resolve, reject) => {
		return youtubedl.getInfo(link, (err, info) => {
			if (err)
				reject(err)
			else {
				resolve(info)
			}
		})
	});
}

module.exports = generateVideo;
