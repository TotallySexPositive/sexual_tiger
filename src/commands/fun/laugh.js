const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "laugh");	

}

exports.help = () =>{
    return "hahaha";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "laugh",
        command: "laugh",
        description: "Post an image of anime laugh.",
        syntax: 'laugh',
        examples: [
            {
                description: "Post image of laugh",
                code: `laugh`
            }
        ]
    }
    return docs;
};