const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "goodbye");	
}

exports.help = () =>{
    return "BYeeeee!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "goodbye",
        command: "goodbye",
        description: "Post an image of anime goodbye.",
        syntax: 'goodbye',
        examples: [
            {
                description: "Post image of goodbye",
                code: `goodbye`
            }
        ]
    }
    return docs;
};