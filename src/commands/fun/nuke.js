const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('nuke').startTimer()
    UTIL.postRandomImageByTag(message, "nuke");	
    end()
}

exports.help = () =>{
    return "KaBoom!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "nuke",
        command: "nuke",
        description: "Post an image of anime nuke.",
        syntax: 'nuke',
        examples: [
            {
                description: "Post image of nuke",
                code: `nuke`
            }
        ]
    }
    return docs;
};