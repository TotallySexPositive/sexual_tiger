const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "punch");	
}

exports.help = () =>{
    return "PUNCH PUNCH PUNCH PUNCH PUNCH!";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "punch",
        command: "punch",
        description: "Post an image of anime punch.",
        syntax: 'punch',
        examples: [
            {
                description: "Post image of punch",
                code: `punch`
            }
        ]
    }
    return docs;
};