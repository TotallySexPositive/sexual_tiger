const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "sleep",
    aliases       : [],
    description   : "Post an image of anime sleep.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("sleep").startTimer();
        UTIL.postRandomImageByTag(message, "sleep");
        end();
    }
};