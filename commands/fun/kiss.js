const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "kiss",
    aliases       : [],
    description   : "Post an image of anime kiss.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("kiss").startTimer();
        UTIL.postRandomImageByTag(message, "kiss");
        end();
    }
};