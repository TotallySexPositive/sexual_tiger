const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "sorry",
    aliases       : [],
    description   : "Post an image of anime sorry.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("sorry").startTimer();
        UTIL.postRandomImageByTag(message, "sorry");
        end();
    }
};