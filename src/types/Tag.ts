export class Tag {
    TAG_FIELDS: string = "tag.tag_id, tag.name "
    constructor(obj: any){
        this.id = obj.tag_id;
        this.name = obj.name;
    }
    id: any;
    name: string;
}