const path  = require("path");
import * as UTIL from "../../utils";

exports.run = (client, message, args) => {
    
    UTIL.postRandomImageByTag(message, "pat");	

}

exports.help = () =>{
    return "pat pat pat";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "pat",
        command: "pat",
        description: "Post an image of anime pat.",
        syntax: 'pat',
        examples: [
            {
                description: "Post image of pat",
                code: `pat`
            }
        ]
    }
    return docs;
};