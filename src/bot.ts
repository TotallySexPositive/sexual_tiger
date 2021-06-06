const path = require("path");
const Discord = require('discord.js');
const auth = require(path.resolve('auth.json'));
const config = require(path.resolve('configure.json'));
import glob from "glob"
import { promisify } from "util"
import {Command} from "./types/Command"
import burn from "./commands/fun/burn"

const globPromise = promisify(glob)

const commands: Command[] = []
//commands.push(burn)

const client = new Discord.Client();

client.on('ready', async () => {
    console.log('I am ready!');
    const commandFiles = await globPromise(`${__dirname}/commands/fun/*{.js,.ts}`)

    for (const file of commandFiles) {
        const command = await import(file)
        commands.push(command)
    }
});
client.on('message', message => {
    if (message.author.bot || message.content.indexOf(config.prefix) !== 0) {
        return;
    }
    
    burn.execute(client, message, []);
});

client.login(auth.token);

function Burn(Burn: any) {
    throw new Error("Function not implemented.");
}
