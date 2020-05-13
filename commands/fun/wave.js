const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "wave",
    aliases       : [],
    description   : "Post an image of anime wave.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("wave").startTimer();
        UTIL.postRandomImageByTag(message, "wave");
        end();
    }
};