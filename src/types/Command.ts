import {Client, Message} from "discord.js";
import { Example } from "./Example";

export class Command {
	name: string;
	aliases: string[];
	description: string;
	defaultAccess: number;
	parent: string;
	syntax: string;
	category: string;
	subcategory: string;
	examples: Example[];

	constructor(obj: any) {
		this.name           = obj.name;
		this.aliases        = obj.aliases;
		this.description    = obj.description;
		this.defaultAccess  = obj.default_access;
		this.syntax         = obj.usage;
		this.parent         = obj.parent;
	}

	execute(client: Client, message: Message, args: Array<string>) {
		message.reply("Sorry, this command has not been fully implemented.");
	}
	help(client: Client, message: Message, args: Array<string>) {
		message.reply("Sorry, this command's help function has not be implemented.")
	}
}