const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "burn");	
}

exports.help = () =>{
    return "Siiick....";
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "burn",
        command: "burn",
        description: "Post an image of anime burn.",
        syntax: 'burn',
        examples: [
            {
                description: "Post image of burn",
                code: `burn`
            }
        ]
    }
    return docs;
};