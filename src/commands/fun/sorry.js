const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('sorry').startTimer()
    UTIL.postRandomImageByTag(message, "sorry");	
    end()
}

exports.help = () =>{
    return "Gomen'nasai";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sorry",
        command: "sorry",
        description: "Post an image of anime sorry.",
        syntax: 'sorry',
        examples: [
            {
                description: "Post image of sorry",
                code: `sorry`
            }
        ]
    }
    return docs;
};