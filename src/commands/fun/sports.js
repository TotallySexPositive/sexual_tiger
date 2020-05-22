const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('sports').startTimer()
    UTIL.postRandomImageByTag(message, "sports");	
    end()
}

exports.help = () =>{
    return "Sports Ball";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
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