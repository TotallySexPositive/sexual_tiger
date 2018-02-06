let fs = require('fs');
let path = require('path');
let cfg = require('../configure.json')
let asciitable = require("asciitable")
exports.run = (client, message, args) => {

    let options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "command", name: "Command"},
            {field: "halp",    name: "Details"}
        ],
    };

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
