const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "death");	
}

exports.help = () =>{
    return "X.X";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "death",
        command: "death",
        description: "Post an image of anime death.",
        syntax: 'death',
        examples: [
            {
                description: "Post image of death",
                code: `death`
            }
        ]
    }
    return docs;
};