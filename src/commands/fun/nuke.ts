const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "nuke");	

}

exports.help = () =>{
    return "KaBoom!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "nuke",
        command: "nuke",
        description: "Post an image of anime nuke.",
        syntax: 'nuke',
        examples: [
            {
                description: "Post image of nuke",
                code: `nuke`
            }
        ]
    }
    return docs;
};