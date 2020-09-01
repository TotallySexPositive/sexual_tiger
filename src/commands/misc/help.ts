const fs = require('fs');
const path = require('path');
const c = path.resolve("configure.json")
console.log(c)
const cfg = require(c)
import { MessageEmbed, Client, Message } from 'discord.js';
import { CustomNodeJsGlobal } from '../../types/CustomNodeJsGlobal'
import { Doc } from '../../types/Doc';
import { Example } from '../../types/Example';
declare const global: CustomNodeJsGlobal;

exports.run = (client: Client, message: Message, args) => {
    if (args.length < 1) {
        const embed = new MessageEmbed()
        embed.setTitle("Command Categories")
        embed.setColor(16312092)
        embed.setTimestamp()
        global.commandTypes.forEach((i) => {
            embed.addField(i, global.commandTypeDesc[i])
        })

        message.channel.send({ embed })
    } else {
        if (global.commandTypes.includes(args[0])) {
            let excess_commands = 0;
            const t = args[0]
            const embed = new MessageEmbed()
            embed.setTitle(`${t} Commands`)
            embed.setColor(global.commandTypeColor[t])
            embed.setTimestamp()
            const p = path.resolve("built", "commands", t);
            fs.readdir(p, (err, items) => {
                items.forEach((item) => {
                    if (item.endsWith('.js')) {
                        const script = path.resolve(p, item);
                        const temp = require(script);
                        const k = Object.keys(temp);

                        const cmd = `${cfg.prefix}${item.replace(".js", "")}`
                        let hlp = "empty";
                        if (k.includes("help")) {
                            hlp = `${temp.help()}`;
                        }

                        try {
                            embed.addField(cmd, hlp)
                        } catch (err) {
                            excess_commands = excess_commands + 1;
                        }
                    }
                });

                message.channel.send({ embed }).catch((err) => {
                    console.error(err.message);
                    console.log(embed)
                });
                if (excess_commands > 0) {
                    message.channel.send(`It looks like there were ${excess_commands} more commands we cant display here because we have too many fucking commands.  Oops?`);
                }
            })

        }
    }
}

exports.help = () => {
    return "Really?";
};

exports.docs = () => {
    const doc = new Doc(
        1,
        "Misc",
        "general",
        "",
        "help",
        "help",
        "Displays general usage info for commands.  Not so good when looking for image commands.",
        "help [category]"
    );
    doc.addExample(new Example("Get help with admin commands", "help admin"))
    return doc;
};