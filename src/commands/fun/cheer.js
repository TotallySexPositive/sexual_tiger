const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "cheer");	

}

exports.help = () =>{
    return "Give me an A!";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "cheer",
        command: "cheer",
        description: "Post an image of anime cheer.",
        syntax: 'cheer',
        examples: [
            {
                description: "Post image of cheer",
                code: `cheer`
            }
        ]
    }
    return docs;
};