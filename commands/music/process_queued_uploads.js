const path  = require("path");
const fs    = require("fs");
const UTIL  = require(path.resolve("utils.js"));
const Queue = require("better-queue");

module.exports = {
	name          : "process_queued_uploads",
	aliases       : [],
	description   : "Tell the bot to process any songs that have been FTP uploaded onto the server",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Admin", "General"],
	execute(message, args) {
		let end                   = global.metrics.summaries.labels("process_queued_uploads").startTimer();
		let uploaded_audio_folder = global.audio_dirs.uploaded;

		let files_to_process = fs.readdirSync(uploaded_audio_folder).filter(file => file !== ".placeholder");
		let q                = new Queue(UTIL.processAudioFileTask, function (err, result) {
			console.log("Call back of Queue");
		});

		q.on("drain", function () {message.channel.send("Done processing all files in queue.");});

		files_to_process.some(function (file) {
			let uploaded_file_path = path.resolve(uploaded_audio_folder, file);
			console.log(`Adding file ${uploaded_file_path} to the queue.`);
			q.push({file_path: uploaded_file_path, url: null, message: message}).on("finish", function (result) {
				message.channel.send(result);
			})
			 .on("failed", function (err) {
				 message.channel.send(err);
			 });
		});
		end();
	}
};