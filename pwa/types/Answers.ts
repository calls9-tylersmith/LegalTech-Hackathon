import { Item } from "./item";

export class Answers implements Item {
  public "@id"?: string;

  constructor(
    _id?: string,
    public name?: string,
    public issueType?: string,
    public defects?: string,
    public image?: string
  ) {
    this["@id"] = _id;
  }
}
