const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('goodbye').startTimer()
    UTIL.postRandomImageByTag(message, "goodbye");	
    end()
}

exports.help = () =>{
    return "BYeeeee!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "goodbye",
        command: "goodbye",
        description: "Post an image of anime goodbye.",
        syntax: 'goodbye',
        examples: [
            {
                description: "Post image of goodbye",
                code: `goodbye`
            }
        ]
    }
    return docs;
};