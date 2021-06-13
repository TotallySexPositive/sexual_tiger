import { Client, Message } from "discord.js";
import fs from "fs";
import path from "path";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";
const Queue = require("better-queue");
declare const global: CustomNodeJsGlobal;

class Audio extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let uploaded_audio_folder = global.audio_dirs.uploaded;

		let files_to_process = fs.readdirSync(uploaded_audio_folder).filter((file) => file !== ".placeholder");
		const q = new Queue(UTIL.processAudioFileTask, function(err, result) {
			console.log("Call back of Queue");
		});

		q.on("drain", function() {
			message.channel.send("Done processing all files in queue.");
		});

		files_to_process.some(function(file) {
			let uploaded_file_path = path.resolve(uploaded_audio_folder, file);
			console.log(`Adding file ${uploaded_file_path} to the queue.`);
			q.push({ file_path: uploaded_file_path, url: null, message: message })
				.on("finish", function(result) {
					message.channel.send(result);
				})
				.on("failed", function(err) {
					message.channel.send(err);
				});
		});
	}
}

const processQueuedUploads: Command = new Audio({
	name: "process_queued_uploads",
	aliases: [],
	description: "Tell the bot to process any songs that have been FTP uploaded onto the server",
	defaultAccess: 0,
	parent: "",
	syntax: "process_queued_uploads",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Tell the bot to process any ftp uploaded songs.",
			code: "process_queued_uploads",
		},
	],
});

export default processQueuedUploads;
