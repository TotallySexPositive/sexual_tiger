import * as Sentry from "@sentry/node";
import { Message } from "discord.js";
import { recursive } from "recursive-readdir";
import { Command } from "./types/Command";
import { AudioDirectories, CustomNodeJsGlobal, ImageDirectories } from "./types/CustomNodeJsGlobal";
import { Server } from "./types/Server";
import * as UTIL from "./utils.js";

const path = require("path");
const fs = require("fs");
const Discord = require("discord.js");
const Sanitize = require("sanitize-filename");
const auth = require(path.resolve("auth.json"));
const config = require(path.resolve("configure.json"));

const client = new Discord.Client();
const commands: Record<string, Command> = {};

Sentry.init({
	dsn: auth["sentry"],
	tracesSampleRate: 1.0,
	environment: "dev",
});

declare const global: CustomNodeJsGlobal;
global.servers = new Map();
const audioDirs: AudioDirectories = {
	tmp: path.resolve("audio", "tmp"),
	hashed: path.resolve("audio", "hashed"),
	stored: path.resolve("audio", "stored"),
	uploaded: path.resolve("audio", "uploaded"),
};

global.audio_dirs = audioDirs;

const imageDirs: ImageDirectories = {
	tmp: path.resolve("images", "tmp"),
	hashed: path.resolve("images", "hashed"),
	trash: path.resolve("images", "trash"),
};
global.image_dirs = imageDirs;

global.clip_length = 30;

//Array of directories required for bot to operate, make sure all parent directories appear before sub directories in list. IE: make sure audio exists, before trying to make audio/hashed
const required_folders = [
	path.resolve("audio"),
	path.resolve("audio", "tmp"),
	path.resolve("audio", "hashed"),
	path.resolve("audio", "stored"),
	path.resolve("audio", "uploaded"),
	path.resolve("images"),
	path.resolve("images", "tmp"),
	path.resolve("images", "hashed"),
	path.resolve("images", "trash"),
];
//Loop the array of required folders and create any missing ones.
required_folders.forEach(function (dir) {
	if (!fs.existsSync(dir)) {
		console.log(`Created missing directory: ${dir}`);
		fs.mkdirSync(dir);
	}
});

//Update the command table incase any new commands were added or a default access has been changed.
UTIL.updateCommandList();

client.on("ready", async () => {
	console.log("I am ready!");
	client.user.setActivity("pick up sticks.");

	//Loop through the commands directory and get all paths to files, then add the command to the commands map.
	recursive(path.resolve("built", "commands"), function (err, files) {
		files.forEach(async (file) => {
			if (file.endsWith(".js")) {
				const command = await import(file);
				commands[command.default.name] = command.default;
			}
		});
	});

	//Init servers array and update member list
	client.guilds.cache.each((guild) => {
		global.servers[guild.id] = new Server();
		guild.members
			.fetch()
			.then((members) => {
				UTIL.updateMembersList(members);
			})
			.catch(console.error);
	});
});

client.on("message", (message: Message) => {
	// If we are reading a bot message or the message doesn't start with our prefix, ignore it
	if (message.author.bot || message.content.indexOf(config.prefix) !== 0) {
		return;
	}

	//Split into args
	const args: Array<string> = message.content.slice(config.prefix.length).trim().split(/ +/g);
	//Get just the command
	const commandName = args.shift().toLowerCase();
	//Need to sanitize the user input

	try {
		const c: Command = commands[commandName];
		if (c !== null) {
			//Check User Access
			const isAllowed = UTIL.isUserActionAllowed(message.author, c, message.guild.id);

			if (isAllowed) {
				const transaction = Sentry.startTransaction({
					op: "command",
					name: c.name,
				});

				try {
					c.execute(client, message, args);
				} catch (e) {
					console.error(e);
					Sentry.captureException(e);
				} finally {
					transaction.finish();
				}
			} else {
				message.channel.send(`${message.author.username}, you do not have permission to use this command.`);
			}
		} else {
			message.channel.send("Couldn't find a command for your input: " + message.content);
		}
	} catch (err) {
		message.channel.send(`ERROR: ${err.message}`);
		console.error(err);
		Sentry.captureException(err);
	}
});

// Create an event listener for new guild members
client.on("guildMemberAdd", (member) => {
	// Send the message to a designated channel on a server:
	const channel = member.guild.channels.find("name", "general");
	// Do nothing if the channel wasn't found on this server
	if (!channel) return;
	// Send the message, mentioning the member
	channel.send(`Welcome to the server, ${member}`);
});

client.login(auth.token);
function recursive(command_folders_path: any, arg1: (err: any, files: any) => void) {
	throw new Error("Function not implemented.");
}
