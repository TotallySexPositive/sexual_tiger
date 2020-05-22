const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('cheer').startTimer()
    UTIL.postRandomImageByTag(message, "cheer");	
    end()
}

exports.help = () =>{
    return "Give me an A!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "cheer",
        command: "cheer",
        description: "Post an image of anime cheer.",
        syntax: 'cheer',
        examples: [
            {
                description: "Post image of cheer",
                code: `cheer`
            }
        ]
    }
    return docs;
};