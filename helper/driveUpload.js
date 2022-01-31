const stream = require('stream');
const { google } = require('googleapis');
const CLIENT_ID = process.env.OAUTH_CLIENTID;
const CLIENT_SECRET = process.env.OAUTH_CLIENT_SECRET;
const REDIRECT_URI = 'https://developers.google.com/oauthplayground';
const REFERESH_TOKEN = process.env.OAUTH_REFRESH_TOKEN;
var fs = require('fs');
const path = require('path');
const oauht2client = new google.auth.OAuth2(CLIENT_ID, CLIENT_SECRET, REDIRECT_URI);
oauht2client.setCredentials({ refresh_token: REFERESH_TOKEN });
const { v4: uuidv4 } = require('uuid');
const drive = google.drive({
  version: 'v3',
  auth: oauht2client,
});

const uploadFile = async (file) => {
  try {
    let bufferStream = new stream.PassThrough();
    await bufferStream.end(file.buffer);
    const filename = uuidv4() + path.extname(file.originalname);
    const fileMetadata = {
      name: filename,
      parents: [process.env.DRIVE_PARENT],
    };
    const media = {
      mimeType: file.mimetype,
      body: bufferStream, //fs.createReadStream(__dirname + '/files/one.jpg'),
    };
    const response = await drive.files.create({
      resource: fileMetadata,
      media: media,
    });

    await drive.permissions.create({
      fileId: response.data.id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });
    return Promise.resolve(response);
  } catch (ex) {
    return Promise.reject(ex);
  }
};

const deleteFile = async (imageId) => {
  try {
    const response = await drive.files.delete({
      fileId: imageId,
    });
    console.log(response.data, response.status);
  } catch (error) {
    console.log(error.message);
  }
};

const generateUrl = async (id) => {
  try {
    await drive.permissions.create({
      fileId: id,
      requestBody: {
        role: 'reader',
        type: 'anyone',
      },
    });

    const result = await drive.files.get({
      fileId: id,
      fields: 'webViewLink,webContentLink',
    });
    return Promise.resolve(result.data);
  } catch (ex) {
    return Promise.reject(ex);
  }
};

module.exports = { uploadFile, deleteFile, generateUrl };
