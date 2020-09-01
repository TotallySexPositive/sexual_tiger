const fs        = require("fs")
let Database    = require('better-sqlite3')
let DB          = new Database('playlists.sql');

// eslint-disable-next-line no-unused-vars
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
        default_access: 0,
        tab: "admin",
        link: "general",
        parent: "",
        full_command: "build_table",
        command: "build_table",
        description: "Builds the sql table structure for first time setup.",
        syntax: "build_table",
        examples: [
            {
                description: "Builds the sql table structure.",
                code: "build_table"
            }
        ]
    }
    return docs;
};