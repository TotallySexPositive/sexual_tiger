const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "wave");	
}

exports.help = () =>{
    return "Wave!!";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "wave",
        command: "wave",
        description: "Post an image of anime wave.",
        syntax: 'wave',
        examples: [
            {
                description: "Post image of wave",
                code: `wave`
            }
        ]
    }
    return docs;
};