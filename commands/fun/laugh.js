const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "laugh",
    aliases       : [],
    description   : "Post an image of anime laugh.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("laugh").startTimer();
        UTIL.postRandomImageByTag(message, "laugh");
        end();
    }
};