const probe = require("node-ffprobe");
const path = require("path");
const fs = require("fs");
import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";

declare const global: CustomNodeJsGlobal;

class ProbeAudio extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let files_to_process = fs.readdirSync(global.audio_dirs.hashed);

		probe.SYNC = true;
		files_to_process.some(function(file) {
			probe(path.resolve(global.audio_dirs.hashed, file)).then((data) => {
				let { err: s_err, song } = DAL.findSongByIdentifier(file.substring(0, 32));
				if (s_err) {
					console.log("Failed to find song in DB that existed in hash folder.  Uh oh...");
					console.log(file.substring(0, 32));
				} else {
					song.duration = Math.ceil(data.streams[0].duration);
					DAL.updateSong(song);
				}
			});
		});
	}
}

const probeAudio: Command = new ProbeAudio({
	name: "probe_audio",
	aliases: [],
	description: "Probes all hashed audio files and updates their length in the database.",
	defaultAccess: 0,
	parent: "",
	syntax: "probe_audio",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Probe all audio clips to update length.",
			code: `probe_audio`,
		},
	],
});

export default probeAudio;
