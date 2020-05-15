const probe = require("node-ffprobe");
const path  = require("path");
const fs    = require("fs");
const DAL   = require(path.resolve("dal.js"));
const UTIL  = require(path.resolve("utils.js"));

module.exports = {
	name          : "probe_audio",
	aliases       : [],
	description   : "Probes all hashed audio files and updates their length in the database.",
	default_access: 0,
	args          : false,
	usage         : "",
	parent        : "",
	category      : ["Admin", "General"],
	execute(client, message, args) {
		let end               = global.metrics.summaries.labels("admin_probe_audio").startTimer();
		let hashed_audio_path = global.audio_dirs.hashed;
		let files_to_process  = fs.readdirSync(hashed_audio_path);
		probe.SYNC            = true;
		console.log("Probing audio!");

		files_to_process.some(function (file) {
			probe(path.resolve(hashed_audio_path, file)).then(data => {
				let {err: s_err, song} = DAL.findSongByIdentifier(file.substring(0, 32));
				if (s_err) {
					console.log("Failed to find song in DB that existed in hash folder.  Uh oh...");
					console.log(file.substring(0, 32));
				} else {
					song.duration = Math.ceil(data.streams[0].duration);
					DAL.updateSong(song);
				}
				console.log("in that probe yo");
			});
		});
		console.log("Probing audio Finished!");
		end();
	}
};