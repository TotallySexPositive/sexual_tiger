const sanitize = require("sanitize-filename");
const path = require("path")
const fs = require("fs")

exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    if(args[0]==="all"){
    	//reload all modules
    	let p = path.resolve("commands")
    	fs.readdir(p, (err,items)=>{
    		if(err){return message.channel.send(err.message)}
    		items.forEach((item)=>{
    			if(!item.endsWith('.js'))return;
			    delete require.cache[require.resolve(`./${item}`)];
			    console.log(item)
    		})
    		message.reply(`Reloaded all commands.`);
    	})
    	
    } else{
    	var f = sanitize(args[0]); //sanitize that shit
	    delete require.cache[require.resolve(`./${f}.js`)];
	    message.reply(`The command ${f} has been reloaded`);
    }
    
};