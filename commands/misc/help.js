let fs = require('fs');
let path = require('path');
let cfg = require('../configure.json')


exports.run = (client, message, args) => {

    let embed = new require("Discord").RichEmbed()
    embed.setTitle("Available Commands")
    embed.setAuthor("Fuck you")
    embed.setColor("#3ad1c9")

    p  = path.resolve("commands");
    console.log(p);
    fs.readdir(p, (err,items)=>{
	    let mes = "Available commands: \n";
        let rows = [];
            items.forEach((item)=>{
                if(!item.endsWith('.js'))return;

                script = path.resolve("commands", item);
                temp = require(script);
                k = Object.keys(temp);
                
                let cmd = `${cfg.prefix}${item.replace(".js","")}`
                if (k.includes("help")){
                    hlp = `${temp.help()}`;
                    
                } else{
                    hlp = "";
                }
                rows.push({"command": cmd, "halp":hlp})
	        });

        let table = asciitable(options, rows);
	    
	    message.channel.send(table,{"split":true, "code":true}).catch((err)=>{console.error(err.message);console.log(table)});
    });
};
