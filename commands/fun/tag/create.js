const path = require("path")
const DAL = require(path.resolve("dal.js"))

exports.run = (client, message, args) => {
    
    let name        = args.join(" ");
    if(DAL.isInt(name)) {
        return message.channel.send("Tag names can not be Integers.  Just because.");
    }
    if(name.indexOf(" ") > -1) {
        return message.channel.send("Tag names must only be a single word.")
    }

    let {err, info} = DAL.createTag(name);
    
    if(err && err.message.indexOf("UNIQUE") > -1) {//Unique constraint error
        message.channel.send(`That tag already exists.`);
    } else if (err) { //Unhandled Error
        console.log(err);
        message.channel.send(`Sorry, ${message.author.username}, it seems something unexpected happened.`);
    } else {
        message.channel.send(`The tag ${name} has been created!`);
    }
};

exports.docs = () => {
    let docs = {
        tab: "image",
        link: "tag",
        parent: "tag",
        full_command: "tag create",
        command: "create",
        description: "Create a new Tag in the database. Tag names must be 1 word.  Use this before grab_pics when adding a new set of images.",
        syntax: 'tag create [tag_name]',
        examples: [
            {
                description: "Create new tag called, 'dance'",
                code: `tag create dance`
            }
        ]
    }
    return docs;
};