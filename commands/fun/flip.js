const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('flip').startTimer()
    UTIL.postRandomImageByTag(message, "flip");	
    end()
}

exports.help = () =>{
    return "(╯°□°）╯︵ ";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "flip",
        command: "flip",
        description: "Post an image of anime flip.",
        syntax: 'flip',
        examples: [
            {
                description: "Post image of flip",
                code: `flip`
            }
        ]
    }
    return docs;
};