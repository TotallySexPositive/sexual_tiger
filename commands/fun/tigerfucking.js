const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "tigerfucking");	
}

exports.help = () =>{
    return "Per jc's request";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "tigerfucking",
        command: "tigerfucking",
        description: "Post an image of anime tigerfucking.",
        syntax: 'tigerfucking',
        examples: [
            {
                description: "Post image of tigerfucking",
                code: `tigerfucking`
            }
        ]
    }
    return docs;
};