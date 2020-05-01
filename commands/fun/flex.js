const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "flex");	
}

exports.help = () =>{
    return "The Armstrong Line!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "flex",
        command: "flex",
        description: "Post an image of anime flex.",
        syntax: 'flex',
        examples: [
            {
                description: "Post image of flex",
                code: `flex`
            }
        ]
    }
    return docs;
};