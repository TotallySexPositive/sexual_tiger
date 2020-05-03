const path = require("path")

exports.run = (client, message, args) => {
   var server = global.servers[message.guild.id];
   if(server.connectionPromise)
   {
       server.connectionPromise.then(connection=>{
           connection.dispatcher.end()
       })
   }; 
};

exports.help = () =>{
    return "Skip a song. Why did you even queue it up you bastard?";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "music",
        link: "general",
        parent: "",
        full_command: "skip",
        command: "skip",
        description: "Skip to the next song in the current playlist.",
        syntax: "skip",
        examples: [
            {
                description: "Skip the current song.",
                code: "skip"
            }
        ]
    }
    return docs;
};