const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "sorry");	
}

exports.help = () =>{
    return "Gomen'nasai";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sorry",
        command: "sorry",
        description: "Post an image of anime sorry.",
        syntax: 'sorry',
        examples: [
            {
                description: "Post image of sorry",
                code: `sorry`
            }
        ]
    }
    return docs;
};