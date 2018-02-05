const path = require("path");
const fs = require("fs");
//TODO Switch this to db when adam commits the createtable stuff and playlist stuff
exports.run = (client, message, args) => {
    let jPath = path.resolve("commands", "repeat.json");
    fs.readFile(jPath, (err, data)=> {
        if(err) message.reply(err.message);
        let j = JSON.parse(data);
        if (j.repeat === "true"){
            j.repeat = "false";
            message.channel.send(`Music should not repeat.`);
        }
        else {
            j.repeat = "true";
            message.channel.send(`Music should now repeat.`);
        }
        console.log("done reading file")
        j_str = JSON.stringify(j)
        fs.writeFile(jPath, j_str, (e)=>{
            if(e) message.reply(e.message)
            console.log("done writing file")

        })
    })
};

exports.help = (client,message,args) =>{
    let m = "Toggles whether or not clips and songs will repeat";
    let code = `\`\`\`${m}\`\`\``;
    message.channel.send(code)
};
