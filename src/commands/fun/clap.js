const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('clap').startTimer()
    UTIL.postRandomImageByTag(message, "clap");	
    end()
}

exports.help = () =>{
    return "hand meet other hand.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "clap",
        command: "clap",
        description: "Post an image of anime clap.",
        syntax: 'clap',
        examples: [
            {
                description: "Post image of clap",
                code: `clap`
            }
        ]
    }
    return docs;
};