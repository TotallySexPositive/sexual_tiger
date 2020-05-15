const path   = require("path");
const UTIL   = require(path.resolve("utils.js"));
const TTS    = require("google-tts-api");
const parser = require("yargs-parser");

module.exports = {
	name          : "tts",
	aliases       : [],
	description   : "Converts Text to Speech using Google API.  See https://cloud.google.com/speech-to-text/docs/languages for list of available language codes.",
	default_access: 1,
	args          : true,
	usage         : "[text to convert] | -t \"text to convert\" [-l LANG_CODE] [-r RATE] ",
	parent        : "",
	category      : ["Misc", "General"],
	execute(client, message, args) {
		let end  = global.metrics.summaries.labels("tts").startTimer();
		let opts = {
			alias        : {
				text    : ["t"],
				language: ["l"],
				rate    : ["r"]
			},
			configuration: {
				"short-option-groups": false
			}
		};

		let arg_string = message.content.slice(4); //Chop off $tts
		let argv       = parser(arg_string.replace(/= +/g, "="), opts);
		let lang       = argv.l ? argv.l : "en";
		let rate       = argv.r ? argv.r : 1;
		let text       = argv.t ? argv.t : `${message.author.username} is an idiot`;

		if (!argv.t && !argv.l && !argv.r) {
			text = arg_string;
		}

		TTS(text, lang, rate).then(function (url) {
			let vc = message.member.voice.channel;

			if (vc === undefined) {
				message.channel.send("You must be in a Voice Channel, I'm not gonna play this shit for no one.");
				return;
			}

			vc.join()
			  .then(connection => {
				  UTIL.playUrl(client, connection, message, url, UTIL.playAudioBasicCallBack);
			  }).catch(console.error);
		}).catch(function (err) {
			console.error(err.stack);
		});
		end();
	}
};

exports.run = (client, message, args) => {

};

exports.help = () => {
	return "Text to Speech, but less annoying...";
};

exports.docs = () => {
	let docs = {
		default_access: 1,
		tab           : "Misc",
		link          : "general",
		parent        : "",
		full_command  : "tts",
		command       : "tts",
		description   : "Converts Text to Speech using Google API.  See https://cloud.google.com/speech-to-text/docs/languages for list of available language codes.",
		syntax        : "tts [text to convert] | -t \"text to convert\" [-l LANG_CODE] [-r RATE] ",
		examples      : [
			{
				description: "Say 'Hello fellow humans' in english at normal rate.",
				code       : `tts Hello fellow humans`
			},
			{
				description: "Say 'Hello fellow humans' in english at half normal rate.",
				code       : `tts -t "Hello fellow humans" -r .5`
			},
			{
				description: "Say 'Hello fellow humans' with a french accent at normal rate.",
				code       : `tts -t "Hello fellow humans" -l fr`
			},
			{
				description: "Say 'erbrbrbrbrbrbrbrb' with/in japanese at a quarter normal rate.",
				code       : `tts -t "erbrbrbrbrbrbrbrb" -l JA -r .25`
			}

		]
	};
	return docs;
};