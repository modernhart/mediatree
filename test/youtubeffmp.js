const YoutubeMp3Downloader = require("youtube-mp3-downloader");

//Configure YoutubeMp3Downloader with your settings
const YD = new YoutubeMp3Downloader({
	"ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
	"outputPath": "/workspace/mediatree/mp3",    // Output file location (default: the home directory)
	//"ffmpegPath": "/app/vendor/ffmpeg/ffmpeg",        // FFmpeg binary location (heouku)
	//"outputPath": "/app/mp3",    // Output file location (default: the home directory) (heouku)
	"youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
	"queueParallelism": 2,                  // Download parallelism (default: 1)
	"progressTimeout": 2000                 // Interval in ms for the progress reports (default: 1000)
});

//Download video and save as MP3 file
YD.download("ND-Y_IYvGTc");

YD.on("finished", function(err, data) {
	console.log(JSON.stringify(data));
});

YD.on("error", function(error, data) {
	console.log('data', data)
	console.log(error);
});

YD.on("progress", function(progress) {
	console.log(JSON.stringify(progress));
});

