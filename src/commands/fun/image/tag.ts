const path = require("path");
const fs = require("fs");
import { Client, Message } from "discord.js";
import * as DAL from "../../../dal";
import { Command } from "../../../types/Command";
import * as UTIL from "../../../utils";

class Tag extends Command {
	constructor(obj: any) {
		super(obj);
	}

	execute(_client: Client, message: Message, args: Array<string>): void {
		if (args.length <= 1) {
			message.channel.send(
				"Must send message id and tag names. EX: $image tag [MESSAGE_ID] cry\nTo get message_id, Go to Discord Settings -> Appearance -> Toggle Developer Mode on.\nThen right click image/post and click 'Copy Id'"
			);
		} else {
			const [message_id, ...tag_names] = args;

			//Check if the tags passed in exist.
			let { err: v_err, tags } = UTIL.verifyTags(tag_names);
			if (v_err && tags === undefined) {
				console.log(v_err);
				return;
			} else if (v_err && tags !== undefined) {
				//At least one of the tags didnt exist.
				console.error(new Error(`The following tags do not exist. ${tags.join(", ")}`));
				return;
			} //All tags are valid, lets just move on.

			message.channel.messages
				.fetch(message_id)
				.then((target_message) => {
					let attachment_arr = target_message.attachments.array();
					if (attachment_arr.length === 0) {
						return message.channel.send("That message didnt have any images attached.");
					} else {
						let file_hash = attachment_arr[0].name.replace(/\.[^/.]+$/, "");
						let { err, image } = DAL.findImageByHashId(file_hash);
						if (err) {
							message.channel.send("Crashed finding image.");
						} else if (image === undefined) {
							//No error, but no image, most likely it got deleted but is still in chat.
							message.channel.send("Looks like that image has been deleted.");
						} else {
							let tag_ids = tags.map(function(tag) {
								return tag["tag_id"];
							});
							let { err: it_err, _info } = DAL.insertIntoImageTag([image.image_id], tag_ids);
							if (it_err) {
								return message.channel.send("Crashed adding tags to image.");
							} else {
								return message.channel.send("Tags have been updated.");
							}
						}
					}
				})
				.catch(console.error);
		}
	}
}

const tag: Command = new Tag({
	name: "tag",
	aliases: [],
	description:
		"Tag an image in the database.  You can only add pre-existing tags using this command.  To get message_id, Go to Discord Settings -> Appearance -> Toggle Developer Mode on.  Then right click image/post and click 'Copy Id'",
	defaultAccess: 1,
	parent: "image",
	syntax: "image tag [message_id] [...tag_name, tag_name, tag_name]",
	category: "Image",
	subcategory: "Image",
	examples: [
		{
			description: "Tag an image of punching.",
			code: `image tag 433008356190322688 punch`,
		},
		{
			description: "Tag an image of a death as flex and punch",
			code: `image tag 433008356190322688 punch flex`,
		},
	],
});

export default tag;
