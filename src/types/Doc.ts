import { Example } from "./Example"

export class Doc {
    /**
     * 
     * @param default_access What access level this is
     * @param tab The tab this belongs to for help
     * @param link The link this belongs to for website
     * @param parent The parent command/link?
     * @param full_command The full command to run this
     * @param command The short command
     * @param description The full description of this command
     * @param syntax The syntax in which you can use this command
     */
    constructor(default_access: number, tab: string, link: string, parent: string,
         full_command: string, command: string, description: string, syntax: string) 
    {
        this.default_access = default_access;
        this.tab = tab;
        this.link = link;
        this.parent = parent;
        this.full_command = full_command;
        this.command = command;
        this.description = description
        this.syntax = syntax;
        this.examples = Array();
    }
    /**
     * 
     * @param ex The example you're adding onto the Array of examples
     */
    addExample(ex: Example){
        this.examples.push(ex)
    }
    default_access: number;
    tab: string;
    link: string;
    parent: string;
    full_command: string;
    command: string;
    description: string;
    syntax: string;
    examples: Array<Example>;
}