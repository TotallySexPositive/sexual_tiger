const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "lewd");	

}

exports.help = () =>{
    return "giggity";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "lewd",
        command: "lewd",
        description: "Post an image of anime lewd.",
        syntax: 'lewd',
        examples: [
            {
                description: "Post image of lewd",
                code: `lewd`
            }
        ]
    }
    return docs;
};