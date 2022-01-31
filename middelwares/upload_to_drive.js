const { uploadFile, generateUrl } = require('../helper/driveUpload');
exports.driveUpload = async function (req, res, next) {
  try {
    if (req.files.length > 0) {
      for(const file of req.files) {
        await uploadFile(file).then(async (result) => {
          file.driveUrl = await generateUrl(result.data.id);
          file.driveFieldId = result.data.id;
        });
      }
      next();
    } else {
      next();
    }
  } catch (err) {
    console.log(err);
    next();
  }
};
