const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))
const auth  = require(path.resolve('auth.json'));
const parser    = require('yargs-parser')
const xkcd      = require('xkcd-api');
const { MessageEmbed } = require('discord.js');

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('xkcd').startTimer()
    let arg_string  = message.content.slice(5); //Chop off $xkcd
    let comic_id    = arg_string.trim()

    let is_int = UTIL.isInt(comic_id);

    if(comic_id === "")
    {
        xkcd.latest(function(error, response) 
        {
            if (error) {
              console.error(error);
            } else {
                const exampleEmbed = new MessageEmbed()
                .setColor('GOLD')
                .setTitle(response.title)
                .setImage(response.img)
                .setFooter(response.alt);
                
                message.channel.send(exampleEmbed);
            }
        });
    }
    else if(UTIL.isInt(comic_id))
    {
        xkcd.get(comic_id, function(error, response) 
        {
            if (error) {
              console.error(error);
            } else {
                const exampleEmbed = new MessageEmbed()
                .setColor('GOLD')
                .setTitle(response.title)
                .setImage(response.img)
                .setFooter(response.alt);
                
                message.channel.send(exampleEmbed);
            }
        });
    }
    else
    {
        xkcd.random(function(error, response) 
        {
            if (error) {
              console.error(error);
            } else {
                const exampleEmbed = new MessageEmbed()
                .setColor('GOLD')
                .setTitle(response.title)
                .setImage(response.img)
                .setFooter(response.alt);
                
                message.channel.send(exampleEmbed);
            }
        });
    }
    end()
}


exports.help = () =>{
    return "Get a funny (not guarenteed) commic.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "xckd",
        command: "xckd",
        description: "Grab a XKCD image",
        syntax: 'xckd [comic_id]',
        examples: [
            {
                description: "Post current xkcd",
                code: `xkcd`
            },
            {
                description: "Post xkcd commic id: 614",
                code: `xkcd 614`
            }
        ]
    }
    return docs;
};


/*let xkcd_url = "https://xkcd.com/info.0.json"

    if(comic_id) {
        xkcd_url = `https://xkcd.com/${comic_id}/info.0.json`
    }

    fetch(xkcd_url)
    .then(res => {
        if(res.ok) {
            return res.json()
        }
        else
        {
            return {
                "month": "9", 
                "num": 2200, 
                "link": "", 
                "year": "2019", 
                "news": "", 
                "safe_title": "Unreachable State", 
                "transcript": "", 
                "alt": "ERROR: We've reached an unreachable state. Anything is possible. The limits were in our heads all along. Follow your dreams.", 
                "img": "https://imgs.xkcd.com/comics/unreachable_state.png", 
                "title": "Unreachable State", 
                "day": "9"
            }
        }
    }).then(json => {
        message.channel.send(`${json.title}\n${json.img}`);
        message.channel.send(`\`\`\`${json.alt}\`\`\``);
    });*/