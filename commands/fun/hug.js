const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('hug').startTimer()
    UTIL.postRandomImageByTag(message, "hug");	
    end()
}

exports.help = () =>{
    return "awwww";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "hug",
        command: "hug",
        description: "Post an image of anime hug.",
        syntax: 'hug',
        examples: [
            {
                description: "Post image of hug",
                code: `hug`
            }
        ]
    }
    return docs;
};