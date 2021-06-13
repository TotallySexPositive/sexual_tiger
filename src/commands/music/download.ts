"use strict";

import { Client, Message } from "discord.js";
import path from "path";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";

const sanitize = require("sanitize-filename");
const youtubedl = require("youtube-dl-exec");
const extractDomain = require("extract-domain");
const validator = require("validator");
declare const global: CustomNodeJsGlobal;

class Download extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		let server = global.servers[message.guild.id];

		if (args.length !== 1) {
			message.channel.send("It seems you sent too much or too little info.");
			return;
		}

		let url = args[0];

		if (!validator.isURL(url)) {
			message.channel.send("Invalid url sent.");
			return;
		}

		let domain = extractDomain(url);
		let { err, song } = DAL.findSongByUrl(url);

		if (err) {
			console.log("Shit, what?");
			console.log(err);
			message.channel.send("Ummm, we kind of crashed but are trying to continue, wish me luck.");
		} else if (song !== undefined) {
			message.channel.send(`That clip is already in the DB under the name, ${song.name}`);
		} else {
			youtubedl(url, { dumpSingleJson: true }).then((output) => {
				let save_to = path.resolve(server.download_dirs.tmp, sanitize(output.title) + `.mp3`);
				if (output.duration > 600) {
					//10 minutes
					return message.channel.send("That video is too fucking long.");
				} else {
					youtubedl(url, { "extract-download": true, "download-format": "mp3", output: save_to }).then((output) => {
						message.channel.send(`Done downloading the download from ${domain}.`);
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
	}
}

const download: Command = new Download({
	name: "download",
	aliases: [],
	description:
		"Download a video from a website and add the download to the bot.  All supported sites can be found here, https://ytdl-org.github.io/youtube-dl/supportedsites.html",
	defaultAccess: 1,
	parent: "",
	syntax: "download [url]",
	category: "Music",
	subcategory: "General",
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
});

export default download;
