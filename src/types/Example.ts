export class Example{
    /**
     * 
     * @param description The description of this example
     * @param code The code to execute described by the description
     */

    constructor(description: string, code: string){
        this.description = description;
        this.code = code;
    }
    description: string;
    code: string;
}