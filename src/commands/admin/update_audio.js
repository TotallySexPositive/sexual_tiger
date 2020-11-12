import * as UTIL from "../../utils.js";

// eslint-disable-next-line no-unused-vars
exports.run = (client, message, args) => {
	let end = global.metrics.summaries.labels('admin_update_audio').startTimer()
	let err = UTIL.generateAudioList();
	if(err) {
		message.channel.send(err.message);
	} else {
		message.channel.send("Updated!");
	}
	end()
}

exports.help = () =>{
	return "Rebuilds the Audio list json data file from the current DB.";
};

exports.docs = () => {
	let docs = {
		default_access: 0,
		tab: "admin",
		link: "general",
		parent: "",
		full_command: "update_audio",
		command: "update_audio",
		description: "Rebuilds the 'audio' list.  Rescans the entire DB and regenerates the list of songs..",
		syntax: "update_audio",
		examples: [
			{
				description: "Rebuild audio list.",
				code: "update_audio"
			}
		]
	}
	return docs;
};