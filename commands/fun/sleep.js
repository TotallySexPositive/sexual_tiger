const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "sleep");	
}

exports.help = () =>{
    return "ZzzzzZzzZZZzzzz!";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sleep",
        command: "sleep",
        description: "Post an image of anime sleep.",
        syntax: 'sleep',
        examples: [
            {
                description: "Post image of sleep",
                code: `sleep`
            }
        ]
    }
    return docs;
};