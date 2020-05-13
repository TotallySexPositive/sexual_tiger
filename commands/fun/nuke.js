const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "nuke",
    aliases       : [],
    description   : "Post an image of anime nuke.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("nuke").startTimer();
        UTIL.postRandomImageByTag(message, "nuke");
        end();
    }
};