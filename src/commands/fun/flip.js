const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "flip");	

}

exports.help = () =>{
    return "(╯°□°）╯︵ ";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "flip",
        command: "flip",
        description: "Post an image of anime flip.",
        syntax: 'flip',
        examples: [
            {
                description: "Post image of flip",
                code: `flip`
            }
        ]
    }
    return docs;
};