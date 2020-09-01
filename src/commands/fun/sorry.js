const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "sorry");	

}

exports.help = () =>{
    return "Gomen'nasai";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sorry",
        command: "sorry",
        description: "Post an image of anime sorry.",
        syntax: 'sorry',
        examples: [
            {
                description: "Post image of sorry",
                code: `sorry`
            }
        ]
    }
    return docs;
};