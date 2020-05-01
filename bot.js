const jsonfile  = require('jsonfile');
const path      = require("path");
const fs        = require("fs")
const Discord   = require('discord.js');
const Sanitize  = require('sanitize-filename');
const auth      = require(path.resolve('auth.json'));
const config    = require(path.resolve('configure.json'));
const UTIL      = require(path.resolve('utils.js'));

const client    = new Discord.Client();

global.servers  = {};
global.commandTypes = ["admin", "fun", "misc", "music"];
global.commandTypeDesc = {  
    "admin" : "Admin controls to assist in maintaining the bot.",
    "fun"   : "Random shit that lets you express yourself.",
    "misc"  : "Random shit that may or may not be worth using",
    "music" : "Lets you play music and interact with music things"
} 
global.commandTypeColor = {  
    "admin" : 13632027,
    "fun"   : 12390624,
    "misc"  : 1,
    "music" : 5301186
} 
global.audio_dirs = {
    "tmp"       : path.resolve("audio", "tmp"),
    "hashed"    : path.resolve("audio", "hashed"),
    "stored"    : path.resolve("audio", "stored"),
    "uploaded"  : path.resolve("audio", "uploaded")
}

global.image_dirs = {
    "tmp"       : path.resolve("images", "tmp"),
    "hashed"    : path.resolve("images", "hashed"),
    "trash"     : path.resolve("images", "trash"),
}

global.img_resp_to_tag = {}
global.img_resp_to_tag_order = []
global.img_resp_to_tag_max_len = 100;
global.clip_length = 30;

//Array of directories required for bot to operate, make sure all parent directories appear before sub directories in list. IE: make sure audio exists, before trying to make audio/hashed
let required_folders = [
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
required_folders.forEach(function(dir) {
    if (!fs.existsSync(dir)) {
        console.log(`Created missing directory: ${dir}`);
        fs.mkdirSync(dir);
    }
});

//Update the command table incase any new commands were added or a default access has been changed.
UTIL.updateCommandList();

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("pick up sticks.");
    
    //Init servers array
    client.guilds.keyArray().forEach(server_id => {
        global.servers[server_id] = {repeat: false, maintain_presence: false, dispatcher: null, default_volume: .25, volume: .25, max_volume: 1, clip_volume: .75, super_admins:["231574835694796801","183388696207294465", "231606224909500418"]};
    });
});

client.on('message', message => {
    // If we are reading a bot message or the message doesn't start with our prefix, ignore it
    if (message.author.bot || message.content.indexOf(config.prefix) !== 0){return;}

    const user = message.author.username;

    //Split into args
    const args = message.content.slice(config.prefix.length).trim().split(/ +/g);
    //Get just the command
    const command = args.shift().toLowerCase();
    //Need to sanitize the user input
    var safe = Sanitize(command);

    try {
        d = path.resolve("commands")
        
        global.commandTypes.some((k)=>{
            let p = path.resolve("commands", k,`${safe}.js`)
            if (fs.existsSync(p)) {
                let commandFile = require(p);

                //Check User Access
                let isAllowed = UTIL.isUserActionAllowed(message.author, commandFile)

                if (isAllowed) {
                    commandFile.run(client, message, args);
                } else {
                    message.channel.send(`${user}, you do not have permission to use this command.`);
                }
                
                return true;
            } else {
                if (safe !== command){
                    message.channel.send(`Naughty naughty ${user}.`);
                    message.channel.send("You trying to backdoor me on the first date?");
                }
                return false
            }
        })
    } catch (err) {
        message.channel.send(`ERROR: ${err.message}`)
        console.error(err);
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