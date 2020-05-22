const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('burn').startTimer()
    UTIL.postRandomImageByTag(message, "burn");
    end()
}

exports.help = () =>{
    return "Siiick....";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "burn",
        command: "burn",
        description: "Post an image of anime burn.",
        syntax: 'burn',
        examples: [
            {
                description: "Post image of burn",
                code: `burn`
            }
        ]
    }
    return docs;
};