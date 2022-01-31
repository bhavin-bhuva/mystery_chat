const { decodeBase64Image } = require('../helper/utility');
const mime = require('mime');
const { v4: uuidv4 } = require('uuid');
const { uploadFile, generateUrl } = require('../helper/driveUpload');

exports.filesUpload = async (req, res, next) => {
  try {
    if (req.body) {
      if (req.body.file) {
        if (req.body.file.length > 0) {
          const fileArr = [];
          for (const fileElem of req.body.file) {
            const decodedImg = await decodeBase64Image(fileElem.base64);

            var imageBuffer = decodedImg.data;
            var mimetype = decodedImg.type;
            var extension = mime.extension(mimetype);
            var fileName = `mystery_chat_${uuidv4()}_.` + extension;

            const uploadObject = {
              buffer: imageBuffer,
              originalname: fileName,
              mimetype: mimetype,
            };

            console.log(uploadObject);

            await uploadFile(uploadObject)
              .then(async (result) => {
                let file = {};
                file.originalname = fileName;
                file.mimetype = mimetype;
                file.size = Buffer.byteLength(imageBuffer);
                file.driveUrl = await generateUrl(result.data.id);
                file.driveFieldId = result.data.id;
                file.fieldname = fileElem.type;
                req.files = file;

                fileArr.push(file);
              })
              .catch((err) => {
                console.log(err);
              });
          }

          req.files = fileArr;
          next();
        } else {
          next();
        }
      } else {
        next();
      }
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    next();
  }
};
