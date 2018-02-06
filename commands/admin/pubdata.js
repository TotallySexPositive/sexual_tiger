const {spawn} = require('child_process');
const path = require("path");
const cfg = require(path.resolve("configure.json"))

exports.run = (client, message, args) => {
    const script_path = path.resolve("python","pubg","getstuff.py");
    const db_path = path.resolve("commands", "pubg.sql");
    const py = spawn(cfg.python, [script_path, "getData", '--path', db_path]);
    //message.channel.send(`python3 ${script_path} getData --path ${db_path}`);
    py.stdout.on('data', data=>{
	message.channel.send(`stdout: ${data}`);
    });
    py.stderr.on('data', data=>{
	message.channel.send(`stderr: ${data}`);
	//console.log(`stderr: ${data}`)
    });
    py.on('close', code=>{
	message.channel.send(`Child process exited with code ${code}`);
	//console.log(`Child process exited with code ${code}`)
    });
    py.on('error', error=>{
        console.error(error)
    })
}
exports.help = () =>{
    return "Scrapes the pubg data into a database.";
};