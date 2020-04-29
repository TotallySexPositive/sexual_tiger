const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    UTIL.postRandomImageByTag(message, "flip");	
}

exports.help = () =>{
    return "(╯°□°）╯︵ ";
};

exports.docs = () => {
    let docs = {
        restricted: 0,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "flip",
        command: "flip",
        description: "Post an image of anime flip.",
        syntax: 'flip',
        examples: [
            {
                description: "Post image of flip",
                code: `flip`
            }
        ]
    }
    return docs;
};