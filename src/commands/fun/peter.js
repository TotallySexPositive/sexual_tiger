const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {

	UTIL.postRandomImageByTag(message, "peter");

}

exports.help = () =>{
	return "hand meet other hand.";
};

exports.docs = () => {
	let docs = {
		default_access: 1,
		tab: "image",
		link: "Pictures",
		parent: "",
		full_command: "peter",
		command: "peter",
		description: "Post an image to trigger Peter.",
		syntax: 'peter',
		examples: [
			{
				description: "Post image to trigger Peter",
				code: `peter`
			}
		]
	}
	return docs;
};