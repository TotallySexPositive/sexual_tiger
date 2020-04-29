const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "sports");	
}

exports.help = () =>{
    return "Sports Ball";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sports",
        command: "sports",
        description: "Post an image of anime sports.",
        syntax: 'sports',
        examples: [
            {
                description: "Post image of sports",
                code: `sports`
            }
        ]
    }
    return docs;
};