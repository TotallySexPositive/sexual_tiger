const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "slap");	

}

exports.help = () =>{
    return "Slapppp!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "slap",
        command: "slap",
        description: "Post an image of anime slap.",
        syntax: 'slap',
        examples: [
            {
                description: "Post image of slap",
                code: `slap`
            }
        ]
    }
    return docs;
};