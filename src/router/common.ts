import express from "express";
import uuidV4 from "uuid/v4";
import multer from "multer";
import { getOSS } from "../service/alioss";
import { getOSSOption } from "../demoConfig/index";
import serviceAuth from "../middleware/serviceAuth";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

function getDefaultFilename(originalname) {
  return Date.now() +
    "-" +
    uuidV4().replace(/-/gi, "") +
    "-" +
    originalname;
}

router.post(
  "/upload",
  serviceAuth,
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    try {
      const { file } = req;
      const { encoding, mimetype, size } = file;

      const ossOption = getOSSOption(req.cookies.appId);
      const oss = getOSS(ossOption);

      const result = await oss.upload(getDefaultFilename(file.originalname), file.buffer);
      res.json({
        code: 0,
        errCode: 0,
        url: (result as any).url,
        encoding,
        mimetype,
        size
      });
    } catch (err) {
      res.json({
        code: 999,
        errMessage: err.message
      });
    }
  }
);

export default router;
