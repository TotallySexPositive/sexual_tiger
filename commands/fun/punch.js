const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "punch",
    aliases       : [],
    description   : "Post an image of anime punch.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("punch").startTimer();
        UTIL.postRandomImageByTag(message, "punch");
        end();
    }
};