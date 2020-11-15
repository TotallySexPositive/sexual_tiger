const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "hug");	

}

exports.help = () =>{
    return "awwww";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "hug",
        command: "hug",
        description: "Post an image of anime hug.",
        syntax: 'hug',
        examples: [
            {
                description: "Post image of hug",
                code: `hug`
            }
        ]
    }
    return docs;
};