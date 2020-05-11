const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('lewd').startTimer()
    UTIL.postRandomImageByTag(message, "lewd");	
    end()
}

exports.help = () =>{
    return "giggity";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
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