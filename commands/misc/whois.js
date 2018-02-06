const path = require("path");
const reg = require(path.resolve("commands","people.json"))
exports.run = (client, message, args) => {
    if (args.length < 1)return message.channel.send("Needs to pick a boi to get info on.");
		let user = args[0].toLowerCase();
		if (reg.hasOwnProperty(user)){
			custom = reg[user]
			message.reply(`${user} is ${custom}`);
		}else{
			message.reply(`${user} wasn't cool enough to make the list`);
		}
}

exports.help = () =>{
    return "Snarky list of people.";
};