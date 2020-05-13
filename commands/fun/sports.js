const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "sports",
    aliases       : [],
    description   : "Post an image of anime sports.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("sports").startTimer();
        UTIL.postRandomImageByTag(message, "sports");
        end();
    }
};