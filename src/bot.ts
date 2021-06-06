const path = require("path");
const Discord = require('discord.js');
const auth = require(path.resolve('auth.json'));
const config = require(path.resolve('configure.json'));
import { Message } from "discord.js";
import glob from "glob"
import { promisify } from "util"
import {Command} from "./types/Command"

const globPromise = promisify(glob)

const commands: Record<string,Command> = {};
//commands.push(burn)

const client = new Discord.Client();

client.on('ready', async () => {
    console.log('I am ready!');
    const commandFiles = await globPromise(`${__dirname}/commands/fun/*{.js,.ts}`)

    for (const file of commandFiles) {
        const command = await import(file)
        commands[command.default.name] = command.default
    }
});
client.on('message', (message: Message) =>  {
    if (message.author.bot || message.content.indexOf(config.prefix) !== 0) {
        return;
    }
    const str_arr = message.content.split(" ",2)

    const c: Command = commands[str_arr[0].substring(1,str_arr[0].length)]
    if (c !== null)
    {
        c.execute(client, message, []);
    }
    else
    {
        message.channel.send("Couldn't find a command for your input: " + message.content)
    }
    
});

client.login(auth.token);
