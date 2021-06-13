import { Client, Message } from "discord.js";
import { CustomNodeJsGlobal } from "src/types/CustomNodeJsGlobal";
import * as DAL from "../../dal";
import { Command } from "../../types/Command";

declare const global: CustomNodeJsGlobal;

class Grant extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, _args: Array<string>): void {
		let server = global.servers[message.guild.id];
		let secure_commands = ["revoke", "grant"];

		let arg_string = message.content.slice(6).trim(); //Chop off $grant
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

			if (secure_commands.includes(command.command) && !user_is_super_admin) {
				message.channel.send("You are not allowed to grant/revoke as a non super admin.");
				return;
			}

			let { find_err, access } = DAL.findAccessByUserIdAndCommand(user, command.command);

			if (find_err) {
				console.log("Failed to find access for a command during grant, oops");
				console.log(find_err);
			}
			if (access && access.is_allowed) {
				message.channel.send(`That user already has access to the command, ${command.command}`);
				return;
			}
			let { grant_err, result } = DAL.grantAccessByUserIdAndCommand(user, command.command, message.author.id);

			if (grant_err) {
				console.log(grant_err);
				message.channel.send(`Something went wrong Error: ${grant_err}`);
			} else {
				message.channel.send(`That user has been granted access to the command, ${command.command}`);
			}
		}
	}
}

const grant: Command = new Grant({
	name: "grant",
	aliases: [],
	description: "Grant a user access to a specific command.",
	defaultAccess: 0,
	parent: "",
	syntax: "grant",
	category: "Admin",
	subcategory: "General",
	examples: [
		{
			description: "Grant Adam access to the $vup command.",
			code: "grant @Adam vup",
		},
	],
});

export default grant;
