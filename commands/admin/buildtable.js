const path      = require("path")
const fs        = require("fs")
let Database    = require('better-sqlite3')
let DB          = new Database('playlists.sql');

exports.run = (client, message, args) => {
    const build_it = fs.readFileSync('build.sql', 'utf8');
    DB.exec(build_it);
    DB.close()    
};

exports.help = () =>{
    return "Initializes your tables.";
};

exports.docs = () => {
    let docs = {
        restricted: 1,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "buildtable",
        command: "buildtable",
        description: "Builds the sql table structure for first time setup.",
        syntax: "buildtable",
        examples: [
            {
                description: "Builds the sql table structure.",
                code: "buildtable"
            }
        ]
    }
    return docs;
};