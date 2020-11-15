const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "tigerfucking");	

}

exports.help = () =>{
    return "Per jc's request";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "tigerfucking",
        command: "tigerfucking",
        description: "Post an image of anime tigerfucking.",
        syntax: 'tigerfucking',
        examples: [
            {
                description: "Post image of tigerfucking",
                code: `tigerfucking`
            }
        ]
    }
    return docs;
};