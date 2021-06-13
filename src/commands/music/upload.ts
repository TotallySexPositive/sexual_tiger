import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import request from "request";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";
declare const global: CustomNodeJsGlobal;

class Upload extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let attachments = message.attachments.array();
		if (attachments.length <= 0) {
			message.channel.send("Need to actually attach something");
			return;
		}
		message.channel.send(`Downloading ${attachments.length} attachments.`);

		attachments.forEach((item) => {
			let fpath = path.resolve(global.audio_dirs.uploaded, item.name);
			request(item.url)
				.pipe(fs.createWriteStream(fpath))
				.on("finish", () => {
					UTIL.processAudioFile(fpath, null, message, (err, success) => {
						if (err) {
							message.channel.send(err.message);
						} else {
							message.channel.send(success);
						}
					});
				})
				.on("error", (err) => {
					console.error(err);
				});
		});
	}
}

const upload: Command = new Upload({
	name: "upload",
	aliases: [],
	description:
		"Upload a song to the bot so it can be played back.  Max file size is 8MB due to discord limitations.  Most audio and video formats accepted.  Upload a file and type the command as the comment on the upload.",
	defaultAccess: 1,
	parent: "",
	syntax: "upload",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Upload a song.",
			code: "upload",
		},
	],
});

export default upload;
