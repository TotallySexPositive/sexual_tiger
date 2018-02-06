const {spawn} = require('child_process');
const path = require("path");
const cfg = require(path.resolve("configure.json"))


exports.run = (client, message, args) => {
    var user_name = args[0]
	message.channel.send(`Making plot about drive distance.`);
    doit(client,message,args)    
}
function doit(client,message,args){
    const script_path = path.resolve("python","pubg","getstuff.py");
    const db_path = path.resolve("commands", "pubg.sql");
    var py_args = [script_path, "getDriveBoxPlot", "--path", db_path]
    const py = spawn(cfg.python, py_args);
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
    py.on('error', error=>{
        console.error(error)
    })
}

exports.help = () =>{
    return "Gives you a plot about how far you and your friends drive.";
};