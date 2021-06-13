import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Volume extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		let vc = message.member.voice.channel;

		if (vc === undefined || vc == null) {
			message.channel.send("I'm not even in a channel.");
			return;
		}

		let server = global.servers[message.guild.id];
		let promise = server.connectionPromise;

		if (promise === null) {
			message.channel.send("No audio is playing.  You must be hearing things.");
			return;
		}

		if (args.length === 1) {
			//1 args, set volume.
			let num_vol = Number(args[0]);
			if (num_vol) {
				let req_vol = Math.round(((num_vol > 1 ? num_vol / 100.0 : num_vol) + Number.EPSILON) * 100) / 100;

				if (req_vol > server.max_volume) {
					message.channel.send(`Your request for a volume of ${req_vol * 100}% is higher than the servers max volume of ${server.max_volume * 100}%`);
					return;
				} else if (req_vol < 0) {
					message.channel.send(`Your request for a volume of ${req_vol * 100}% is physically impossible, No.`);
					return;
				}

				promise
					.then((connection) => {
						if (connection.dispatcher != null) {
							connection.dispatcher.setVolume(req_vol);
							server.volume = req_vol;
						}

						return message.channel.send(`Set Volume: ${req_vol * 100}%`);
					})
					.catch((reason) => {
						console.log(reason);
					});
			} else {
				message.channel.send(`Your request for a volume of ${args[0]}% is incompatible with my understanding of sound waves.`);
			}
		} else {
			//0 or 2+ args display volume, send warning
			promise
				.then((connection) => {
					let current_volume = -1;
					if (connection.dispatcher != null) {
						current_volume = connection.dispatcher.volume;
						return message.channel.send(`Current Volume: ${current_volume * 100}%.  To set the volume, send a single number`);
					} else {
						return message.channel.send(`Couldn't find a connection to check the volume one.`);
					}
				})
				.catch((reason) => {
					console.log(reason);
					return message.channel.send(`Dude, I dont even know how I got here, let alone what the volume is.`);
				});
		}
	}
}

const volume: Command = new Volume({
	name: "volume",
	aliases: [],
	description: "Display or set the volume of the bot.  Accepts input as 0-1 or 1.005-100.",
	defaultAccess: 1,
	parent: "",
	syntax: "volume",
	category: "Music",
	subcategory: "General",
	examples: [
		{
			description: "Display current volume",
			code: "volume",
		},
		{
			description: "Set the volume to 50%",
			code: "volume 50",
		},
		{
			description: "Set the volume to 25%",
			code: "volume .25",
		},
	],
});

export default volume;
