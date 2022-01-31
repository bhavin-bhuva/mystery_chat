const { handleEx } = require('../../helper/handle_ex');
const { User, Role } = require('../../models');
module.exports = async (req, res) => {
  if (req.file && req.file.driveUrl) {
    if (req.file.driveUrl.webContentLink && req.file.driveUrl.webViewLink) {
      delete req.file.buffer;
      delete req.file.fieldname;
      delete req.file.encoding;
      res.send({ urls: req.file });
    } else {
      res.send('error in upload or url not genrated');
    }
  } else {
    res.send('file or drive url not found');
  }
};
