const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "clap");	

}

exports.help = () =>{
    return "hand meet other hand.";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "clap",
        command: "clap",
        description: "Post an image of anime clap.",
        syntax: 'clap',
        examples: [
            {
                description: "Post image of clap",
                code: `clap`
            }
        ]
    }
    return docs;
};