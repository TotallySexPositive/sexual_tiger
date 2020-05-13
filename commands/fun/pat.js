const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "pat",
    aliases       : [],
    description   : "Post an image of anime pat.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("pat").startTimer();
        UTIL.postRandomImageByTag(message, "pat");
        end();
    }
};