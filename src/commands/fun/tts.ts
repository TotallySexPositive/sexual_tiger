import { Client, Message } from "discord.js";
import * as GTTS from "google-tts-api";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";
const parser = require("yargs-parser");

class TTS extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, args: Array<string>): void {
		function getBoolean(value) {
			switch (value) {
				case true:
				case "true":
				case 1:
				case "1":
				case "on":
				case "yes":
					return true;
				default:
					return false;
			}
		}

		const opts = {
			alias: {
				text: ["t"],
				language: ["l"],
				slow: ["s"],
			},
			configuration: {
				"short-option-groups": false,
			},
		};
		let arg_string = message.content.slice(4); //Chop off $tts
		let argv = parser(arg_string.replace(/= +/g, "="), opts);

		let lang = "en-US";
		let slow = false;
		let text = `${message.author.username} is an idiot`;

		if (argv.l) {
			lang = argv.l;
		}
		if (argv.s) {
			slow = getBoolean(argv.s);
		}
		if (argv.t && argv.t.trim() !== "") {
			text = argv.t;
		}

		if ((!argv.t || argv.t.trim() !== "") && !argv.l && !argv.s && arg_string.trim() !== "") {
			text = arg_string;
		}

		let url = GTTS.getAudioUrl(text, {
			lang: lang,
			slow: slow,
			//host: 'https://translate.google.com',
			//timeout: 10000
		});

		let vc = message.member.voice.channel;
		if (vc === undefined) {
			message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
			return;
		}
		UTIL.playUrl(url, vc);
	}
}

const image: Command = new TTS({
	name: "tts",
	aliases: [],
	description: "Converts Text to Speech using Google API.  See https://cloud.google.com/speech-to-text/docs/languages for list of available language codes.",
	defaultAccess: 1,
	parent: "",
	syntax: "tts",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Say 'Hello fellow humans' in english at normal rate.",
			code: `tts Hello fellow humans`,
		},
		{
			description: "Say 'Hello fellow humans' in english at slow rate.",
			code: `tts -t "Hello fellow humans" -s true`,
		},
		{
			description: "Say 'Hello fellow humans' with a french accent at normal rate.",
			code: `tts -t "Hello fellow humans" -l fr`,
		},
		{
			description: "Say 'erbrbrbrbrbrbrbrb' with/in japanese at a slow rate.",
			code: `tts -t "erbrbrbrbrbrbrbrb" -l JA -s true`,
		},
	],
});

export default image;
