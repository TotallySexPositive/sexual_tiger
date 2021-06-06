import { Message } from "discord.js";
import glob from "glob"
import { promisify } from "util"
import {Command} from "./types/Command"
import {Server} from "./types/Server"
import {CustomNodeJsGlobal} from "./types/CustomNodeJsGlobal"
import * as UTIL from "./tsutils"
import * as Sentry from '@sentry/node';

const path = require("path");
const Discord = require('discord.js');
const auth = require(path.resolve('auth.json'));
const config = require(path.resolve('configure.json'));
const globPromise = promisify(glob)

const commands: Record<string, Command> = {};

declare const global: CustomNodeJsGlobal;

Sentry.init({ 
    dsn: auth["sentry"],
    tracesSampleRate: 1.0,
    environment: "dev"
 });


const client = new Discord.Client();

client.on('ready', async () => {
    const commandFiles = await globPromise(`${__dirname}/commands/fun/*{.js,.ts}`)

    for (const file of commandFiles) {
        const command = await import(file)
        commands[command.default.name] = command.default
    }

    client.user.setActivity("pick up sticks.");

    //Init servers array and update member list
    client.guilds.cache.each(guild => {
        global.servers[guild.id] = new Server();
        guild.members.fetch().then(members => {
            UTIL.updateMembersList(members);
        }).catch(console.error)
    });

    console.log('I am ready!');
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
