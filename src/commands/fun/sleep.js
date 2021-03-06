const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "sleep");	

}

exports.help = () =>{
    return "ZzzzzZzzZZZzzzz!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "sleep",
        command: "sleep",
        description: "Post an image of anime sleep.",
        syntax: 'sleep',
        examples: [
            {
                description: "Post image of sleep",
                code: `sleep`
            }
        ]
    }
    return docs;
};