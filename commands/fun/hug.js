const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "hug");	
}

exports.help = () =>{
    return "awwww";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "hug",
        command: "hug",
        description: "Post an image of anime hug.",
        syntax: 'hug',
        examples: [
            {
                description: "Post image of hug",
                code: `hug`
            }
        ]
    }
    return docs;
};