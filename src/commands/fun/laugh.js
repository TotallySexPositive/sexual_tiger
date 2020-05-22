const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('laugh').startTimer()
    UTIL.postRandomImageByTag(message, "laugh");	
    end()
}

exports.help = () =>{
    return "hahaha";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "laugh",
        command: "laugh",
        description: "Post an image of anime laugh.",
        syntax: 'laugh',
        examples: [
            {
                description: "Post image of laugh",
                code: `laugh`
            }
        ]
    }
    return docs;
};