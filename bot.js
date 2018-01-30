const Discord = require('discord.js');
const auth = require('./auth.json')
const client = new Discord.Client();

client.on('ready', () => {
    console.log('I am ready!');
});

client.on('message', message => {
    if (message.content==='!ping'){
        message.reply('pong');
    };
});

client.login(auth.token)