const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "sports");	

}

exports.help = () =>{
    return "Sports Ball";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sports",
        command: "sports",
        description: "Post an image of anime sports.",
        syntax: 'sports',
        examples: [
            {
                description: "Post image of sports",
                code: `sports`
            }
        ]
    }
    return docs;
};