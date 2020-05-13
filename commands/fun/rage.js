const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "rage",
    aliases       : [],
    description   : "Post an image of anime rage.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("rage").startTimer();
        UTIL.postRandomImageByTag(message, "rage");
        end();
    }
};