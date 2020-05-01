const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "rock");	
}

exports.help = () =>{
    return "Rock Paper Si!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "rock",
        command: "rock",
        description: "Post an image of anime rock.",
        syntax: 'rock',
        examples: [
            {
                description: "Post image of rock",
                code: `rock`
            }
        ]
    }
    return docs;
};