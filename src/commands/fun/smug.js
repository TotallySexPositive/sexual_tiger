const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "smug");	

}

exports.help = () =>{
    return "（￣へ￣）（’へ’）(￣⊿￣)";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "smug",
        command: "smug",
        description: "Post an image of anime smug.",
        syntax: 'smug',
        examples: [
            {
                description: "Post image of smug",
                code: `smug`
            }
        ]
    }
    return docs;
};