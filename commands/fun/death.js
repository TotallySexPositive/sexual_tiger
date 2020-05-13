const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "death",
    aliases       : [],
    description   : "Post an image of anime death.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("death").startTimer();
        UTIL.postRandomImageByTag(message, "death");
        end();
    }
};