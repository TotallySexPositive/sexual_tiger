const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "kiss");	

}

exports.help = () =>{
    return "dear god I hope this is ok";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "kiss",
        command: "kiss",
        description: "Post an image of anime kiss.",
        syntax: 'kiss',
        examples: [
            {
                description: "Post image of kiss",
                code: `kiss`
            }
        ]
    }
    return docs;
};