const fs            = require("fs");
const path          = require("path");
const DAL           = require(path.resolve("dal.js"));
const UTIL          = require(path.resolve("utils.js"));
const sanitize      = require("sanitize-filename");
const youtubedl     = require("youtube-dl");
const extractDomain = require("extract-domain");
const validator     = require("validator");

module.exports = {
	name          : "download",
	aliases       : [],
	description   : "Download a video from a website and add the audio to the bot.  All supported sites can be found here, https://ytdl-org.github.io/youtube-dl/supportedsites.html",
	default_access: 1,
	args          : true,
	usage         : "",
	parent        : "",
	category      : ["Music", "General"],
	execute(client, message, args) {
		let end   = global.metrics.summaries.labels("download").startTimer();
		let ended = false;

		if (args.length !== 1) {
			return message.channel.send("It seems you sent too much or too little info.");
		}

		let url = args[0];

		if (!validator.isURL(url)) {
			return message.channel.send("Invalid url sent.");
		}

		let domain      = extractDomain(url);
		let {err, song} = DAL.findSongByUrl(url);

		if (err) {
			console.log("Shit, what?");
			console.log(err);
			message.channel.send("Ummm, we kind of crashed but are trying to continue, wish me luck.");
		} else if (song !== undefined) {
			return message.channel.send(`That clip is already in the DB under the name, ${song.name}`);
		} else {
			youtubedl.getInfo(url, undefined, function (err, info) {
				if (err) {
					console.log(err);
					return message.channel.send(`Something happened while trying to download audio from that ${domain} link.`);
				} else if (info.length_seconds > 600) { //10 minutes
					return message.channel.send("That video is too fucking long.");
				} else {
					let save_to     = path.resolve(global.audio_dirs.tmp, sanitize(info.title) + `.mp3`);
					let write_steam = youtubedl(url, ["-x", "--audio-format", "mp3"])
						.pipe(fs.createWriteStream(save_to));

					message.channel.send(`Download of, ${info.title}, from ${domain} has started.`);

					write_steam.on("finish", () => {
						message.channel.send(`Done downloading the audio from ${domain}.`);
						UTIL.processAudioFile(save_to, url, message, (err, success) => {
							if (err) {
								end();
								ended = true;
								message.channel.send(err.message);
							} else {
								end();
								ended = true;
								message.channel.send(success);
							}
						});
					});
				}
			});
		}

		if (ended === false) {
			end();
		}
	}
};