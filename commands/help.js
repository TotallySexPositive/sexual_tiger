var fs = require('fs');
var path = require('path');
exports.run = (client, message, args) => {
    p  = path.resolve("commands");
    console.log(p);
    fs.readdir(p, (err,items)=>{
            console.log(items);
	    var mes = "Available commands: \n";
            items.forEach((item)=>{
                console.log(item);
                if(!item.endsWith('.js'))return;
		mes = mes + "\t!" + item.replace(".js","") + "\n";
	    })

	    var m = `\`\`\`${mes}\`\`\``;
	    message.channel.send(m).catch(console.error);
    })
}
