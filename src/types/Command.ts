"use strict";

import {Client, Message} from "discord.js";

export class Command {
	name: string;
	aliases: Array<string>;
	description: string;
	default_access: number;
	usage: string;
	parent: string;

	constructor(obj: any) {

		const errors = [];

		this.name           = obj.name;
		this.aliases        = obj.aliases;
		this.description    = obj.description;
		this.default_access = obj.default_access;
		this.usage          = obj.usage;
		this.parent         = obj.parent;

		if (errors.length) {
			throw new Error(errors.join("\n"));
		}
	}

	execute(client: Client, message: Message, args: Array<string>) {
		message.reply("Sorry, this command has not been fully implemented.");
	}
	help(client: Client, message: Message, args: Array<string>) {
		message.reply("Sorry, this command's help function has not be implemented.")
	}
}