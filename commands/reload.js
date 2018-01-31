const sanitize = require("sanitize-filename");
exports.run = (client, message, args) => {
    if(!args || args.length < 1 || args.length == undefined) return message.reply("Must provide a command name to reload.");
    // the path is relative to the *current folder*, so just ./filename.js
    var f = sanitize(args[0]); //sanitize that shit
    delete require.cache[require.resolve(`./${f}.js`)];
    message.reply(`The command ${f} has been reloaded`);
};