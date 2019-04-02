import ossConfig from "../config/alioss";
import OSS from "ali-oss";

const store = new OSS({
  accessKeyId: ossConfig.accessKeyId,
  accessKeySecret: ossConfig.accessKeySecret,
  bucket: ossConfig.bucket,
  region: ossConfig.region
});

export async function upload(filename: string, buffer: any) {
  const result: OSS.PutObjectResult = await store.put(filename, buffer);
  return result;
}

export default {
  upload
};
