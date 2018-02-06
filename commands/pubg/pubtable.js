const {spawn} = require('child_process');
const path = require("path");

//Allow user to make table for user
//Allow user to select columns
//Allow user to get all columns
//Allow user to limit number of rows
exports.run = (client, message, args) => {
    if (args.length < 1)return message.channel.send("Needs at least a user. Use --help for more info.")
    if (args[0]=='--help'){
	var text = "Ex. !pubtable Steve";
        text = text + "\nEx2. !pubtable Steve --columns date user_name kills --limit 5";
        //text = text + "\nTo see all column options try !pubtable --help columns";
	var m = `\`\`\`${text}\`\`\``;
	message.channel.send(m);
    }else{
	var user_name = args[0]
	message.channel.send(`Making table for ${user_name}`);
        doit(client,message,args)
    }
}
function doit(client,message,args){
    const script_path = path.resolve("python","pubg","getstuff.py");
    const db_path = path.resolve("commands", "pubg.sql");
    var py_args = [script_path, "makeTable", "--path", db_path, "--user"]
    py_args = py_args.concat(args)
    const py = spawn('python3', py_args);
    //message.channel.send(`python3 ${script_path} getData --path ${db_path}`);
    py.stdout.on('data', data=>{
        var p = data.toString()
        p = p.replace(/[(),'\n\r]+/g,"");
	message.channel.send(`stdout: ${p}`,{
		files: [p]
	});
    });
    py.stderr.on('data', data=>{
	message.channel.send(`stderr: ${data}`);
    });
    py.on('close', code=>{
	message.channel.send(`Child process exited with code ${code}`);
    });
}
