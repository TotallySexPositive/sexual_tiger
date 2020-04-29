const fs            = require('fs');
const path          = require('path');
const assign        = require('assign-deep');
const recursive     = require("recursive-readdir");
const handlebars    = require('handlebars');
const cfg           = require(path.resolve("configure.json"))

exports.run = (client, message, args) => {

   
}

exports.help = () => {
    return "Revoke a user's access to a command or set of commands.";
};

exports.docs = () => {
    let docs = {
        restricted: 1,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "revoke",
        command: "revoke",
        description: "Revoke a users access to a specific command or set of commands.",
        syntax: "revoke",
        examples: [
            {
                description: "Revoke Adam's access to the $vup command.",
                code: "revoke @Adam vup"
            },
            {
                description: "Revoke Adam's access to all $vup, $vdow, $pout, and $dance command.",
                code: "revoke @Adam -c vup -c vdown -c pout -c dance"
            },
            {
                description: "Revoke Adam's access to all $playlist play command.",
                code: "revoke @Adam -c \"playlist play\""
            }
        ]
    }
    return docs;
};