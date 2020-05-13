const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "lewd",
    aliases       : [],
    description   : "Post an image of anime lewd.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("lewd").startTimer();
        UTIL.postRandomImageByTag(message, "lewd");
        end();
    }
};