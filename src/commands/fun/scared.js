const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "scared");	

}

exports.help = () =>{
    return "eeek";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "scared",
        command: "scared",
        description: "Post an image of anime scared.",
        syntax: 'scared',
        examples: [
            {
                description: "Post image of scared",
                code: `scared`
            }
        ]
    }
    return docs;
};