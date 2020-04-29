const sanitize = require("sanitize-filename");
const path = require("path")
const dir = require("node-dir")

exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    let arg = args[0];
    if(arg==="all"){
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
                if(filename.endsWith(".js")){
                    word = arg.substr(0, arg.length - 3)
                    if (filename === arg)
                    {
                        console.log("Exact match, reloading " + filename + ".")
                        delete require.cache[filename];
                        return true;
                        

                    } else if(filename.includes(arg))
                    {
                        console.log("Not exact match, reloading " + filename + " just to be sure.")
                        delete require.cache[filename];
                        return false
                    }
                    
                }else return false;
            })
        })
        message.reply(`Reloaded ${arg}.`);
    }
    
};

exports.help = () =>{
    return "Refreshes a command so you can test changes.";
};

exports.docs = () => {
    let docs = {
        restricted: 1,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "reload",
        command: "reload",
        description: "Refreshes a command so you can test changes.",
        syntax: 'reload [command]',
        examples: [
            {
                description: "Refresh the gifs command.",
                code: `reload gifs`
            }
        ]
    }
    return docs;
};