import { Item } from "./item";

export class Answer implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public issueType?: string,
    public visualDefects?: string,
    public image?: string
  ) {
    this["@id"] = _id;
  }
}
