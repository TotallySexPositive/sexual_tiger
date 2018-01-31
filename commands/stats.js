const sqlite3 = require("sqlite3").verbose();
const path = require("path")
const db = new sqlite3.Database(path.resolve("commands","pubg.sql"));
exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a user name.");
    //Need more sanitize. Don't want a ""Johnny");DROP TABLE user";
    const user = args[0]
    message.channel.send(`Checking for ${user}`)
    try{
        db.each(`SELECT * FROM user WHERE user.name like "${user}"`, (err, row) => {
            if (!row) return message.reply(`${user} not found in the db`);
            message.reply(`Found: ${row.id} ${row.name}`);

        });
        db.each(`SELECT * FROM match WHERE match.user_name like "${user}" LIMIT 3`, (err2, match)=>{
            if (!match) return message.reply(`${user} matches not found in the db`);
            message.reply(`Found: ${match.user_name} ${match.date} ${match.kills} ${match.pubg_id} ${match.mode} ${match.knocks}`)
        })
    } catch(err3){
        message.channel.send(`error executing query for ${user}`);
        console.error(err3);
    }

};