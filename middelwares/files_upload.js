const Busboy = require('busboy');
const os = require('os');
const path = require('path');
const fs = require('fs');

exports.filesUpload = function (req, res, next) {
  const busboy = new Busboy({
    headers: req.headers,
  });

  const fields = {};
  const files = [];
  const fileWrites = [];
  const tmpdir = os.tmpdir();

  busboy.on('field', (key, value) => {
    fields[key] = value;
  });

  busboy.on('file', function (fieldname, file, filename, encoding, mimetype) {
    const filepath = path.join(tmpdir, filename);
    const writeStream = fs.createWriteStream(filepath);
    file.pipe(writeStream);

    writeStream.on('error', function (err) {
      console.log('ERROR:' + err);
      file.unpipe();
      writeStream.end();
    });

    fileWrites.push(
      new Promise((resolve, reject) => {
        if (!filename || !mimetype) {
          resolve();
        } else {
          file.on('end', () => writeStream.end());
          writeStream.on('finish', () => {
            fs.readFile(filepath, (err, buffer) => {
              const size = Buffer.byteLength(buffer);
              if (err) {
                return reject(err);
              }

              files.push({
                fieldname,
                originalname: filename,
                encoding,
                mimetype,
                buffer,
                size,
              });

              try {
                fs.unlinkSync(filepath);
              } catch (error) {
                return reject(error);
              }

              resolve();
            });
          });
          writeStream.on('error', reject);
        }
      })
    );
  });

  busboy.on('finish', () => {
    Promise.all(fileWrites)
      .then(() => {
        req.body = fields;
        req.files = files;
        next();
      })
      .catch(next);
  });

  req.pipe(busboy);
};
