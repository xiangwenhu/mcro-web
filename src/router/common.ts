import express from "express";
import uuidV4 from "uuid/v4";
import multer from "multer";
import alioss from "../service/alioss";

const router = express.Router();

const storage = multer.memoryStorage();
const upload = multer({ storage });

router.get("/check", function(req: express.Request, res: express.Response) {
  if (req.session && req.session.userName && req.session.logined) {
    return res.json({
      code: 0,
      errCode: 0
    });
  }
  return res.json({
    code: 6000,
    errCode: 6000
  });
});

router.post(
  "/upload",
  upload.single("file"),
  async (req: express.Request, res: express.Response) => {
    try {
      const { file } = req;
      const { encoding, mimetype, size } = file;

      const result = await alioss.upload(
        Date.now() +
          "-" +
          uuidV4().replace(/-/gi, "") +
          "-" +
          file.originalname,
        file.buffer
      );
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
