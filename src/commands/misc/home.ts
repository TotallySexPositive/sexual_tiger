import { CustomNodeJsGlobal } from "../../types/CustomNodeJsGlobal"
import { Doc } from "../../types/Doc"
import { Example } from "../../types/Example";
import { Message, Client } from "discord.js";
declare const global: CustomNodeJsGlobal;
exports.run = (client: Client, message: Message, _args) => {
    message.channel.send("Come visit me at, https://tiger.wentzel.dev")
}

exports.help = () => {
    return "Display link to my home";
};

exports.docs = () => {
    const doc = new Doc(
        1,
        "Misc",
        "general",
        "",
        "home",
        "home",
        "Displays the link to the Sexual Tiger website.",
        "home"
    );
    doc.addExample(
        new Example("Get Link", "home")
    )
    return doc;
};