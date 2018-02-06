const sanitize = require("sanitize-filename");
const path = require("path")
const fs = require("fs")

exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    if(args[0]==="all"){
        //reload all modules
        global.commandTypes.forEach(i=>{
            let p = path.resolve("commands", i);

            fs.readdir(p, (err,items)=>{
                if(err){return message.channel.send(err.message)}
                items.forEach((item)=>{
                    if(!item.endsWith('.js'))return;
                    delete require.cache[path.resolve("commands", i, item)];
                    console.log(item)
                })
                
            })
        })
        message.reply(`Reloaded all commands.`);
        
    } else{
        global.commandTypes.some((i)=>{
            p = path.resolve("commands", i, args[0]+".js")
            if (fs.existsSync(p)){
                delete require.cache[p];
                message.reply(`The command ${args[0]} has been reloaded`);
            }else{
                //message.reply(`Fuck you, ${p} didn't exist.`)
            }
            
        })
        
    }
    
};

exports.help = () =>{
    return "Refreshes a command so you can test changes.";
};