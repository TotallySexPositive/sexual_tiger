const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "scared",
    aliases       : [],
    description   : "Post an image of anime scared.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("scared").startTimer();
        UTIL.postRandomImageByTag(message, "scared");
        end();
    }
};