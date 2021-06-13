import { Client, Message } from "discord.js";
import { Command } from "../../types/Command";
import * as UTIL from "../../utils";

class WhoAmI extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(client: Client, message: Message, _args: Array<string>): void {
		const author = message.author;
		const member = message.member;

		const is_admin: boolean = UTIL.isAdmin(member);

		const description = `
            User id: ${author.id}
            Username: ${author.username}
            Nickname: ${member.nickname}
            Display Name: ${member.displayName}
            Discriminator: ${author.discriminator}
            On Server: ${message.guild.id}
            isAdmin: ${is_admin}
        `.replace(/\n +/g, `\n`);

		message.channel.send(description);
	}
}

const whoami: Command = new WhoAmI({
	name: "whoami",
	aliases: [],
	description: "Displays some general information about the user.",
	defaultAccess: 1,
	parent: "",
	syntax: "whoami",
	category: "Misc",
	subcategory: "General",
	examples: [
		{
			description: "Get info on yourself",
			code: "whoami",
		},
	],
});

export default whoami;
