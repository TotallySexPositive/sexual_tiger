const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "pout");	
}

exports.help = () =>{
    return "Pouty pouty pout";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "pout",
        command: "pout",
        description: "Post an image of anime pout.",
        syntax: 'pout',
        examples: [
            {
                description: "Post image of pout",
                code: `pout`
            }
        ]
    }
    return docs;
};