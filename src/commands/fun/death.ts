const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "death");	

}

exports.help = () =>{
    return "X.X";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "death",
        command: "death",
        description: "Post an image of anime death.",
        syntax: 'death',
        examples: [
            {
                description: "Post image of death",
                code: `death`
            }
        ]
    }
    return docs;
};