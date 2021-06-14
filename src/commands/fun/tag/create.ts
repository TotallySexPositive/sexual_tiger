import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";

class Create extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		const name = args.join(" ");
		if (DAL.isInt(name)) {
			message.channel.send("Tag names can not be Integers.  Just because.");
			return;
		}
		if (name.indexOf(" ") > -1) {
			message.channel.send("Tag names must only be a single word.");
			return;
		}

		const { err, _info } = DAL.createTag(name);

		if (err && err.message.indexOf("UNIQUE") > -1) {
			//Unique constraint error
			message.channel.send(`That tag already exists.`);
		} else if (err) {
			//Unhandled Error
			console.log(err);
			message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
		} else {
			message.channel.send(`The tag ${name} has been created!`);
		}
	}
}

const create: Command = new Create({
	name: "create",
	aliases: [],
	description: "Create a new Tag in the database. Tag names must be 1 word.  Use this before grab_pics when adding a new set of images.",
	defaultAccess: 1,
	parent: "tag",
	syntax: "tag create [tag_name]",
	category: "Image",
	subcategory: "Tag",
	examples: [
		{
			description: "Create new tag called, 'dance'",
			code: `tag create dance`,
		},
	],
});

export default create;
