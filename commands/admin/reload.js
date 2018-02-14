const sanitize = require("sanitize-filename");
const path = require("path")
const dir = require("node-dir")

exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    if(args[0]==="all"){
        //reload all modules
        dir.files(path.resolve("commands"), (err, files)=>{
            if(err)console.error(err);
            files.forEach((filename)=>{
                if(!filename.endsWith(".js"))return;
                console.log(filename)
                delete require.cache[filename];
            })
        })
        message.reply(`Reloaded all commands.`);
        
    } else{
        dir.files(path.resolve("commands"), (err, files)=>{
            if(err)console.error(err);
            files.some((filename)=>{
                if(filename.endsWith(".js") && filename.includes(args[0])){
                    console.log(filename)
                    delete require.cache[filename];
                    return true;
                }else return false;
            })
        })
        message.reply(`Reloaded ${args[0]}.`);
    }
    
};

exports.help = () =>{
    return "Refreshes a command so you can test changes.";
};