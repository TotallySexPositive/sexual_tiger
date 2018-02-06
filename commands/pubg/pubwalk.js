const {spawn} = require('child_process');
const path = require("path");

//Allow user to make table for user
//Allow user to select columns
//Allow user to get all columns
//Allow user to limit number of rows
exports.run = (client, message, args) => {
	message.channel.send(`Making walk distance tail and whisker plots`);
	doit(client,message,args)
}
function doit(client,message,args){
    const script_path = path.resolve("python","pubg","getstuff.py");
    const db_path = path.resolve("commands", "pubg.sql");
    var py_args = [script_path, "getWalkBoxPlot", "--path", db_path]
    
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
