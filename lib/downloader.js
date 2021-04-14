var YoutubeMp3Downloader = require("youtube-mp3-downloader");

var Downloader = function(videoId) {

    var self = this;
	self.videoId = videoId; 
    
    //Configure YoutubeMp3Downloader with your settings
    self.YD = new YoutubeMp3Downloader({
        //"ffmpegPath": "/usr/bin/ffmpeg",        // FFmpeg binary location
		//"outputPath": "/workspace/mediatree/medias",    // Output file location (default: the home directory)
		"ffmpegPath": "/app/vendor/ffmpeg/ffmpeg",        // FFmpeg binary location (heouku)
		"outputPath": "/app/medias",    // Output file location (default: the home directory) (heouku)
		"youtubeVideoQuality": "highestaudio",  // Desired video quality (default: highestaudio)
		"queueParallelism": 2,                  // Download parallelism (default: 1)
		"progressTimeout": 2000                 // Interval in ms for the progress reports (default: 1000)
    });

    self.callbacks = {};

    self.YD.on("finished", function(error, data) {
		console.log(JSON.stringify(data));
		
        if (self.callbacks[self.videoId]) {
            self.callbacks[self.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }
    
    });

    self.YD.on("error", function(error, data) {
		console.log('download error', error)
        if (self.callbacks[self.videoId]) {
            self.callbacks[self.videoId](error, data);
        } else {
            console.log("Error: No callback for videoId!");
        }
     
    });

};

Downloader.prototype.extractAudio = function(fileName, callback){

    var self = this;
	let mediaName = null
	
	if (fileName && !fileName.includes('.mp3')) {
		mediaName = fileName + '.mp3'
	} else {
		mediaName = fileName
	}

    // Register callback
    self.callbacks[self.videoId] = callback;
    // Trigger download
    self.YD.download(self.videoId, mediaName);

};

module.exports = Downloader;