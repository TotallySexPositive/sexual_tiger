const Discord = require('discord.js');
const Sanitize = require('sanitize-filename');
const auth = require('./auth.json');
const config = require('./configure.json');
const client = new Discord.Client();
const started = Date.now();

client.on('ready', () => {
    console.log('I am ready!');
    client.user.setActivity("Fuckin wit yo mind");
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
        let commandFile = require(`./commands/${safe}.js`);
        commandFile.run(client, message, args);
    } catch (err) {
        if (safe !== command){
            message.channel.send(`Naughty naughty ${user}.`);
            message.channel.send("You trying to backdoor me on the first date?");
        } else {
            message.channel.send(`Invalid command ${safe}`)
        }
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

