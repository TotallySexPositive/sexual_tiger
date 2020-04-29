const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "clap");	
}

exports.help = () =>{
    return "hand meet other hand.";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
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