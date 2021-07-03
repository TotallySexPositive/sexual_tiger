"use strict";

const fs = require("fs");
const path = require("path");
import * as DAL from "../../dal";
import * as UTIL from "../../utils";
const sanitize = require("sanitize-filename");
const youtubedl = require("youtube-dl-exec");
const extractDomain = require("extract-domain");
const validator = require("validator");

exports.run = (client, message, args) => {
	let server = global.servers[message.guild.id];

	if (args.length !== 1) {
		return message.channel.send("It seems you sent too much or too little info.");
	}

	let url = args[0];

	if (!validator.isURL(url)) {
		return message.channel.send("Invalid url sent.");
	}

	let domain = extractDomain(url);
	let { err, song } = DAL.findSongByUrl(url);

	if (err) {
		console.log("Shit, what?");
		console.log(err);
		message.channel.send("Ummm, we kind of crashed but are trying to continue, wish me luck.");
	} else if (song !== undefined) {
		return message.channel.send(`That clip is already in the DB under the name, ${song.name}`);
	} else {
		youtubedl(url, { dumpSingleJson: true }).then((output) => {
			console.log(output);
			console.log(JSON.stringify(output));
			let save_to = path.resolve(global.audio_dirs.tmp, sanitize(output.title) + `.mp3`);
			if (output.duration > 600) {
				//10 minutes
				return message.channel.send("That video is too fucking long.");
			} else {
				youtubedl(url, { "extract-audio": true, "audio-format": "mp3", output: save_to }).then((output) => {
					message.channel.send(`Done downloading the audio from ${domain}.`);
					UTIL.processAudioFile(save_to, url, message, (err, success) => {
						if (err) {
							message.channel.send(err.message);
						} else {
							message.channel.send(success);
						}
					});
				});
				return message.channel.send(`Download of, ${output.title}, from ${domain} has started.`);
			}
		});
	}
};

exports.help = () => {
	return "Downloads a video's audio and stores it in the DB";
};

exports.docs = () => {
	let docs = {
		default_access: 1,
		tab: "music",
		link: "general",
		parent: "",
		full_command: "download",
		command: "download",
		description:
			"Download a video from a website and add the audio to the bot.  All supported sites can be found here, https://ytdl-org.github.io/youtube-dl/supportedsites.html",
		syntax: "download [url]",
		examples: [
			{
				description: "Add a song from youtube to the bot",
				code: "download https://www.youtube.com/watch?v=U9t-slLl30E",
			},
			{
				description: "Add a song from soundcloud to the bot",
				code: "download https://soundcloud.com/exploita/mr-krabs-robot-dance",
			},
		],
	};
	return docs;
};
