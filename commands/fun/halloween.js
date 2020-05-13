const path = require("path");
const UTIL = require(path.resolve("utils.js"));

module.exports = {
    name          : "halloween",
    aliases       : [],
    description   : "Post an image of anime halloween.",
    default_access: 1,
    args          : false,
    usage         : "",
    parent        : "",
    category      : ["Image", "Pictures"],
    execute(message, args) {
        let end = global.metrics.summaries.labels("halloween").startTimer();
        UTIL.postRandomImageByTag(message, "halloween");
        end();
    }
};