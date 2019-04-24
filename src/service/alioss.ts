import OSS from "ali-oss";
import IOSSOption from "../types/IOSSOption";

export class OSSHelper {
  private $option: IOSSOption;
  private $store: OSS = null;

  constructor(option: IOSSOption) {
    this.$option = option;
  }

  get store() {
    if (this.$store === null) {
      this.$store = new OSS(this.$option);
    }
    return this.$store;
  }

  public async upload(filename: string, buffer: any) {
    const result: OSS.PutObjectResult = await this.store.put(filename, buffer);
    return result;
  }
}

export function getOSS(option: IOSSOption) {
  return new OSSHelper(option);
}
