const path = require("path")

exports.run = (client, message, args) => {

    if(!args.length) return message.channel.send("You must search for something.");
    let clauses = [];
    let prepped_args = [];

    args.forEach((arg) => {
        clauses.push("name LIKE ?");
        prepped_args.push(`%${arg}%`);
    })
        
    let prepped_statement = clauses.join(" AND ")
    let query = `SELECT * FROM song WHERE ${prepped_statement} LIMIT 5`
    
    DB.all(query, prepped_args, (err, rows) => {

        if(err){
            console.log(err);
            message.channel.send(`Sorry ${message.author.username} for some reason the search failed.`);
        }
        else{
            if (!rows.length) return message.channel.send(`No matches for, "**${args.join(" ")}**", found in the DB.`);

            let results = "Results: \n";
            rows.forEach(function (song) {
                results = results + `${song.song_id}: ${song.name}\n`;
            });
            message.channel.send("```" + results + "```");
        }
    })
};

exports.help = () =>{
    return "Search the database for a song name.";
};