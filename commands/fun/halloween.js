const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "halloween");	
}

exports.help = () =>{
    return "Spoopy!";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "halloween",
        command: "halloween",
        description: "Post an image of anime Halloween.",
        syntax: 'halloween',
        examples: [
            {
                description: "Post image of Halloween",
                code: `halloween`
            }
        ]
    }
    return docs;
};