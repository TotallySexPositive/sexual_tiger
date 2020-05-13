const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "hug",
    aliases       : [],
    description   : "Post an image of anime hug.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("hug").startTimer();
        UTIL.postRandomImageByTag(message, "hug");
        end();
    }
};