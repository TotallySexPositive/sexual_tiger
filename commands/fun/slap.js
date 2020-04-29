const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "slap");	
}

exports.help = () =>{
    return "Slapppp!";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "slap",
        command: "slap",
        description: "Post an image of anime slap.",
        syntax: 'slap',
        examples: [
            {
                description: "Post image of slap",
                code: `slap`
            }
        ]
    }
    return docs;
};