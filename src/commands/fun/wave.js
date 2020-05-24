const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('wave').startTimer()
    UTIL.postRandomImageByTag(message, "wave");	
    end()
}

exports.help = () =>{
    return "Wave!!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "wave",
        command: "wave",
        description: "Post an image of anime wave.",
        syntax: 'wave',
        examples: [
            {
                description: "Post image of wave",
                code: `wave`
            }
        ]
    }
    return docs;
};