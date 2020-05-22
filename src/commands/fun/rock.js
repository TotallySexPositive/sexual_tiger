const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('rock').startTimer()
    UTIL.postRandomImageByTag(message, "rock");	
    end()
}

exports.help = () =>{
    return "Rock Paper Si!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "rock",
        command: "rock",
        description: "Post an image of anime rock.",
        syntax: 'rock',
        examples: [
            {
                description: "Post image of rock",
                code: `rock`
            }
        ]
    }
    return docs;
};