const path  = require("path");
import { Client, Message } from "discord.js";
import {Command} from "../../types/Command"
import {postRandomImageByTag} from "../../utils"
class Burn extends Command {
	constructor(obj: any) {
		super(obj)
	}

    execute(_client: Client, message: Message, _args: Array<string>): void {
		message.channel.send("Fucking burn bro.")
		postRandomImageByTag(message, "burn");
    }
    help(): void {
        console.log("Help")
    }
}

const burn: Command = new Burn({
    name: "burn",
	aliases: [],
	description: "Post an image of anime burn.",
	defaultAccess: 1,
	parent: "",
	syntax: "burn",
	category: "Image",
	subcategory: "Pictures",
	examples: [{
        "description": "Post image of burn",
        "code": `burn`
    }],
});

export default burn;