const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('dance').startTimer()
    UTIL.postRandomImageByTag(message, "dance");	
    end()
}

exports.help = () =>{
    return "to the left, cha cha real slow";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "dance",
        command: "dance",
        description: "Post an image of anime dance.",
        syntax: 'dance',
        examples: [
            {
                description: "Post image of dance",
                code: `dance`
            }
        ]
    }
    return docs;
};