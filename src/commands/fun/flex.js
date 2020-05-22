const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('flex').startTimer()
    UTIL.postRandomImageByTag(message, "flex");	
    end()
}

exports.help = () =>{
    return "The Armstrong Line!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "flex",
        command: "flex",
        description: "Post an image of anime flex.",
        syntax: 'flex',
        examples: [
            {
                description: "Post image of flex",
                code: `flex`
            }
        ]
    }
    return docs;
};