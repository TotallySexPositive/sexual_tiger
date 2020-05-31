"use strict";

import {Client, Message} from "discord.js";

export interface ICommand {
	name: string;
	aliases: Array<string>;
	description: string;
	default_access: number;
	usage: string;
	parent: string;

	execute(client: Client, message: Message, args: Array<string>);
}