const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('tigerfucking').startTimer()
    UTIL.postRandomImageByTag(message, "tigerfucking");	
    end()
}

exports.help = () =>{
    return "Per jc's request";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "tigerfucking",
        command: "tigerfucking",
        description: "Post an image of anime tigerfucking.",
        syntax: 'tigerfucking',
        examples: [
            {
                description: "Post image of tigerfucking",
                code: `tigerfucking`
            }
        ]
    }
    return docs;
};