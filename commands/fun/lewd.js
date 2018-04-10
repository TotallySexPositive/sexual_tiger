const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "lewd");	
}

exports.help = () =>{
    return "giggity";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "lewd",
        command: "lewd",
        description: "Post an image of anime lewd.",
        syntax: 'lewd',
        examples: [
            {
                description: "Post image of lewd",
                code: `lewd`
            }
        ]
    }
    return docs;
};