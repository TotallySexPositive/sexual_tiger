const path = require("path")
const asciitable = require("asciitable")
exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a user name.");
    //Need more sanitize. Don't want a ""Johnny");DROP TABLE user";
    const user = args[0]
    message.channel.send(`Checking for ${user}`)
    
    var options = {
        skinny: true,
        intersectionCharacter: "+",
        columns: [
            {field: "username", name: "User"},
            {field: "mode",     name: "Mode"},
            {field: "kills",    name: "Kills"},
            {field: "knocks",   name: "DBNO"},
            {field: "date",     name: "Date"},
            {field: "pubg_id",  name: "PUBG ID"},
        ],
    };

    try{

        DB.each(`SELECT * FROM user WHERE user.name LIKE "${user}"`, (err, row) => {
            if (!row) return message.reply(`${user} not found in the db`);
            message.reply(`Found: ${row.id} ${row.name}`);
        });

        let matches = [];
        DB.all(`SELECT * FROM match WHERE match.user_name LIKE "${user}" LIMIT 5`, (err2, rows)=>{
            if (!rows.length) return message.reply(`${user} matches not found in the db`);
            rows.forEach(function (row) {
                matches.push({
                        "username"  : row.user_name,
                        "date"      : row.date,
                        "kills"     : row.kills, 
                        "pubg_id"   : row.pubg_id,
                        "mode"      : row.mode,
                        "knocks"    : row.knocks
                    });
            });

            let table = asciitable(options, matches);
            message.channel.send("```" + table + "```")
        })
        
    } catch(err3){
        message.channel.send(`error executing query for ${user}`);
        console.error(err3);
    }
};