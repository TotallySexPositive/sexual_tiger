const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "cry",
    aliases       : [],
    description   : "Post an image of anime cry.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("cry").startTimer();
        UTIL.postRandomImageByTag(message, "cry");
        end();
    }
};