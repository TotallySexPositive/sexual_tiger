const path  = require("path");
const UTIL  = require(path.resolve("utils.js"))

exports.run = (client, message, args) => {
    const NS_PER_SEC = 1e9;
    const time = process.hrtime();
    UTIL.postRandomImageByTag(message, "pout");	
    const diff = process.hrtime(time);
    console.log(`UtilPostImage ${(diff[0] * NS_PER_SEC + diff[1])/1000000} ms`);
}

exports.help = () =>{
    return "Pouty pouty pout";
};

exports.docs = () => {
    let docs = {
        default_access: 1,
        tab: "image",
        link: "Pictures",
        parent: "",
        full_command: "pout",
        command: "pout",
        description: "Post an image of anime pout.",
        syntax: 'pout',
        examples: [
            {
                description: "Post image of pout",
                code: `pout`
            }
        ]
    }
    return docs;
};