const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    let end = global.metrics.summaries.labels('rage').startTimer()
    UTIL.postRandomImageByTag(message, "rage");	
    end()
}

exports.help = () =>{
    return "Ahhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhhh";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "rage",
        command: "rage",
        description: "Post an image of anime rage.",
        syntax: 'rage',
        examples: [
            {
                description: "Post image of rage",
                code: `rage`
            }
        ]
    }
    return docs;
};