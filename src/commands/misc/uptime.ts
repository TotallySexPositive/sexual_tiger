import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";

class Uptime extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, _args: Array<string>): void {
		const time = timeConversion(client.uptime);
		message.channel.send(`I've been up for ${time}!`).catch(console.error);
	}
}

const uptime: Command = new Uptime({
	name: "uptime",
	aliases: [],
	description: "Display how long the bot has been up.",
	defaultAccess: 1,
	parent: "",
	syntax: "uptime",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Get bot uptime.",
			code: "uptime",
		},
	],
});

export default uptime;

function timeConversion(millisec: number) {
	const secs: number = Math.floor(millisec / 1000);
	let days: string = Math.floor(secs / 86400).toFixed(0);
	let hours: string = (Math.floor(secs / 3600) % 24).toFixed(0);
	let minutes: string = (Math.floor(secs / 60) % 60).toFixed(0);
	let seconds: string = (secs % 60).toFixed(0);
	seconds = seconds.padStart(2, "0");
	minutes = minutes.padStart(2, "0");
	hours = hours.padStart(2, "0");
	days = days.padStart(2, "0");

	return `${days} days ${hours}:${minutes}:${seconds}`;
}
