const jsonfile  = require('jsonfile');
const path      = require("path");
const fs        = require("fs")
const Discord   = require('discord.js');
const Sanitize  = require('sanitize-filename');
const auth      = require(path.resolve('auth.json'));
const config    = require(path.resolve('configure.json'));

const client    = new Discord.Client();

global.VOLUME   = .25;
global.servers  = {};
global.commandTypes = ["admin", "fun", "misc", "music", "pubg"];
global.commandTypeDesc = {  "admin": "Admin controls to assist in maintaining the bot.",
                            "fun": "Random shit that lets you express yourself.",
                            "misc": "Random shit that may or may not be worth using",
                            "music": "Lets you play music and interact with music things",
                            "pubg": "Pull fun stats from pubg!"
                         } 
global.commandTypeColor = {  "admin": 13632027,
                            "fun": 12390624,
                            "misc": 1,
                            "music": 5301186,
                            "pubg": 4289797
                         } 

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("Fuckin wit yo mind");
    
    //Init servers array
    client.guilds.keyArray().forEach(server_id => {
        global.servers[server_id] = {repeat: false, maintain_presence: false, dispatcher: null};
    });
});

client.on('message', message => {
    // If we are reading a bot message, ignore it
    if (message.author.bot){
        return;
    }
    const user = message.author.username;

    //Never forget foxwell
    if (message.content.includes("foxwell")){
        const foxwell = client.emojis.find("name", "foxwell");
        const sad = "\:crying_cat_face:";
        message.channel.send(`${foxwell} Never forget her ${user}. ${sad} ${foxwell}`);
    }

    // If the message doesn't start with our prefix, don't go further
    if (message.content.indexOf(config.prefix) !== 0){return;};

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
            if (fs.existsSync(p)){
                let commandFile = require(p);
                commandFile.run(client, message, args);
                return true;
            } 
            else{
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