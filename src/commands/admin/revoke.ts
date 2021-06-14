const path = require("path");
import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";
declare const global: CustomNodeJsGlobal;

class Revoke extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		//THERE ARE TOO MANY EXITS YOU MONSTER

		let server = global.servers[message.guild.id];
		let secure_commands = ["revoke", "grant"];

		let arg_string = message.content.slice(7).trim(); //Chop off $revoke
		let user = arg_string.substr(0, arg_string.indexOf(" ")).slice(3, -1);
		let str_command = arg_string.substr(arg_string.indexOf(" ") + 1);

		if (!arg_string || !user || !str_command) {
			message.channel.send("You must provide a user and command.");
			return;
		}

		let { err, command } = DAL.findCommandByName(str_command);

		if (command === undefined) {
			message.channel.send(`${str_command} is not a valid command.`);
		} else {
			let user_is_super_admin = server.super_admins.includes(user);

			if (secure_commands.includes(command.command) && user_is_super_admin) {
				message.channel.send("You are not allowed to grant/revoke from super admins.");
				return;
			}

			let { find_err, access } = DAL.findAccessByUserIdAndCommand(user, command.command);
			if (find_err) {
				console.log("Failed to find access for a command during revoke, oops");
				console.log(find_err);
			}
			if (access && !access.is_allowed) {
				message.channel.send(`That user already does not have access to the command, ${command.command}`);
				return;
			}

			let { grant_err, result } = DAL.revokeAccessByUserIdAndCommand(user, command.command, message.author.id);
			if (grant_err) {
				message.channel.send(`Something went wrong Error: ${grant_err}`);
			} else {
				message.channel.send(`That user's access has been revoked for the command, ${command.command}`);
			}
		}
	}
}

const revoke: Command = new Revoke({
	name: "revoke",
	aliases: [],
	description: "Revoke a users access to a specific command or set of commands.",
	defaultAccess: 0,
	parent: "",
	syntax: "revoke [command]",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Revoke Adam's access to the $vup command.",
			code: "revoke @Adam vup",
		},
		{
			description: "Revoke Adam's access to all $playlist commands.",
			code: "revoke @Adam playlist",
		},
		{
			description: "Revoke Adam's access to the $playlist play command.",
			code: 'revoke @Adam -c "playlist play"',
		},
	],
});

export default revoke;
