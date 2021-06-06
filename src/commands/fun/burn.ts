const path  = require("path");
import { Client, Message } from "discord.js";
import { Command } from "src/types/Command";
import { Example } from "src/types/Example";


class Burn extends Command {
	constructor(obj: any) {
		super(obj)
	}

    execute(_client: Client, message: Message, _args: Array<string>): void {
        console.log("FUCK")
    }
    help(): void {
        console.log("Help")
    }
}

const burn = new Burn({
    name: "burn",
	aliases: [],
	description: "Post an image of anime burn.",
	defaultAccess: 1,
	parent: "",
	syntax: "burn",
	category: "Image",
	subcategory: "Pictures",
	examples: [{
        "description": "Post image of burn",
        "code": `burn`
    }],
});



export default burn;

// const path  = require("path");
// import { Client, Message } from "discord.js";
// import { Example } from "src/types/Example";


// class Burn {
//     name: string;
// 	aliases: string[];
// 	description: string;
// 	defaultAccess: number;
// 	parent: string;
// 	syntax: string;
// 	category: string;
// 	subcategory: string;
// 	examples: Example[];

// 	constructor(obj: any) {
// 		this.name           = obj.name;
// 		this.aliases        = obj.aliases;
// 		this.description    = obj.description;
// 		this.defaultAccess  = obj.default_access;
// 		this.syntax         = obj.usage;
// 		this.parent         = obj.parent;
//         this.category       = obj.category;
//         this.subcategory    = obj.subcategory;
//         this.examples       = obj.examples;
// 	}

//     execute(_client: Client, message: Message, _args: Array<string>): void {
//         console.log("FUCK")
//     }
//     help(): void {
//         console.log("Help")
//     }
// }

// const burn = new Burn({
//     name: "burn",
// 	aliases: [],
// 	description: "Post an image of anime burn.",
// 	defaultAccess: 1,
// 	parent: "",
// 	syntax: "burn",
// 	category: "Image",
// 	subcategory: "Pictures",
// 	examples: [{
//         "description": "Post image of burn",
//         "code": `burn`
//     }],
// });



// export default burn;