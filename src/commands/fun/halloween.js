const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('halloween').startTimer()
    UTIL.postRandomImageByTag(message, "halloween");	
    end()
}

exports.help = () =>{
    return "Spoopy!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "halloween",
        command: "halloween",
        description: "Post an image of anime Halloween.",
        syntax: 'halloween',
        examples: [
            {
                description: "Post image of Halloween",
                code: `halloween`
            }
        ]
    }
    return docs;
};