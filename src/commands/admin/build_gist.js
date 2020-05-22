const path  = require("path")
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('admin_build_gist').startTimer()
    let err = UTIL.rebuildAudioGist();
    if(err) {
        message.channel.send(err.message);
    } else {
        message.channel.send("Updated!");
    }
    end()
}

exports.help = () =>{
    return "Rebuilds the Audio Gist on github from the current DB.";
};

exports.docs = () => {
    let docs = {
        default_access: 0,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "build_gist",
        command: "build_gist",
        description: "Rebuilds the 'audio' gist.  Rescans the entire DB and regenerates the list of songs..",
        syntax: "build_gist",
        examples: [
            {
                description: "Rebuild audio gist.",
                code: "build_gist"
            }
        ]
    }
    return docs;
};