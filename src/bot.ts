import {Server} from "./types/Server";
import {run as build_table} from "./commands/admin/build_table"
const path = require("path");
const fs = require("fs")
const Discord = require('discord.js');
const Sanitize = require('sanitize-filename');
const auth = require(path.resolve('auth.json'));
const config = require(path.resolve('configure.json'));
import * as UTIL from "./utils.js";

const client = new Discord.Client();
import * as Sentry from '@sentry/node';

Sentry.init({ 
    dsn: auth["sentry"],
    tracesSampleRate: 1.0,
    environment: "dev"
 });
// eslint-disable-next-line no-unused-vars

import { CustomNodeJsGlobal } from "./types/CustomNodeJsGlobal"
import {Snowflake}            from "discord.js";
import {Tag}                  from "./types/Tag";

declare const global: CustomNodeJsGlobal;
global.servers = new Map();
global.commandTypes = ["admin", "fun", "misc", "music"];
global.commandTypeDesc = new Map();
global.commandTypeDesc["admin"] = "Admin controls to assist in maintaining the bot.";
global.commandTypeDesc["fun"] = "Random shit that lets you express yourself.";
global.commandTypeDesc["misc"] = "Random shit that may or may not be worth using";
global.commandTypeDesc["music"] = "Lets you play music and interact with music things";

global.commandTypeColor = new Map();
global.commandTypeColor["admin"] = 13632027
global.commandTypeColor["fun"] = 12390624
global.commandTypeColor["misc"] = 1
global.commandTypeColor["music"] = 5301186

global.audio_dirs = new Map();
global.audio_dirs["tmp"] = path.resolve("audio", "tmp");
global.audio_dirs["hashed"] = path.resolve("audio", "hashed");
global.audio_dirs["stored"] = path.resolve("audio", "stored");
global.audio_dirs["uploaded"] = path.resolve("audio", "uploaded");

global.image_dirs = new Map();
global.image_dirs["tmp"] = path.resolve("images", "tmp");
global.image_dirs["hashed"] = path.resolve("images", "hashed");
global.image_dirs["trash"] = path.resolve("images", "trash");


global.img_resp_to_tag = new Map<Snowflake, Tag>();
global.img_resp_to_tag_order = [];
global.img_resp_to_tag_max_len = 100;
global.clip_length = 30;

//Array of directories required for bot to operate, make sure all parent directories appear before sub directories in list. IE: make sure audio exists, before trying to make audio/hashed
const required_folders = [
    path.resolve("audio"),
    path.resolve("audio", "tmp"),
    path.resolve("audio", "hashed"),
    path.resolve("audio", "stored"),
    path.resolve("audio", "uploaded"),
    path.resolve("images"),
    path.resolve("images", "tmp"),
    path.resolve("images", "hashed"),
    path.resolve("images", "trash"),
];
//Loop the array of required folders and create any missing ones.
required_folders.forEach(function (dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Created missing directory: ${dir}`);
        fs.mkdirSync(dir);
    }
});

//Update the command table incase any new commands were added or a default access has been changed.
build_table();
UTIL.updateCommandList();

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("pick up sticks.");

    //Init servers array and update member list
    client.guilds.cache.each(guild => {
        global.servers[guild.id] = new Server();
        guild.members.fetch().then(members => {
            UTIL.updateMembersList(members);
        }).catch(console.error)
    })
});

client.on('message', message => {
    // If we are reading a bot message or the message doesn't start with our prefix, ignore it
    if (message.author.bot || message.content.indexOf(config.prefix) !== 0) {
        return;
    }

    const user = message.author.username;

    //Split into args
    const args: Array<string> = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //Get just the command
    const command = args.shift().toLowerCase();
    //Need to sanitize the user input
    const safe = Sanitize(command);

    try {
        const d = path.resolve("built", "commands")

        global.commandTypes.some((k) => {
            const p = path.resolve(d, k, `${safe}.js`)
            if (fs.existsSync(p)) {
                const commandFile = require(p);

                //Check User Access
                const isAllowed = UTIL.isUserActionAllowed(message.author, commandFile, message.guild.id)
                
                if (isAllowed) {
                    const transaction = Sentry.startTransaction({
                        op: "command",
                        name: command,
                    });
                    try {
                        commandFile.run(client, message, args);
                    } catch (e) {
                        console.error(e);
                        Sentry.captureException(e);
                    } finally {
                        transaction.finish();
                    }
                    
                } else {
                    message.channel.send(`${user}, you do not have permission to use this command.`);
                    
                }

                return true;
            } else {
                if (safe !== command) {
                    message.channel.send(`Naughty naughty ${user}.`);
                    message.channel.send("You trying to backdoor me on the first date?");
                }
                return false
            }
        })
    } catch (err) {
        message.channel.send(`ERROR: ${err.message}`)
        console.error(err);
        Sentry.captureException(err);
    }
});

// Create an event listener for new guild members
client.on('guildMemberAdd', member => {
    // Send the message to a designated channel on a server:
    const channel = member.guild.channels.find('name', 'general');
    // Do nothing if the channel wasn't found on this server
    if (!channel) return;
    // Send the message, mentioning the member
    channel.send(`Welcome to the server, ${member}`);
});

client.login(auth.token);