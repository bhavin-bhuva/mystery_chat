const nodemailer = require('nodemailer');
const { google } = require('googleapis');
var fs = require('fs');

exports.sendEmail = async (to, subject, html, from = null) => {
  const oAuth2client = new google.auth.OAuth2(
    process.env.OAUTH_CLIENTID,
    process.env.OAUTH_CLIENT_SECRET,
    process.env.OAUTH_REFRESH_TOKEN
  );

  oAuth2client.setCredentials({
    refresh_token: process.env.OAUTH_REFRESH_TOKEN,
  });
  const accessToken = await oAuth2client.getAccessToken();

  const mailTransporter = nodemailer.createTransport({
    service: 'gmail',
    auth: {
      type: 'OAuth2',
      user: process.env.CLIENT_G_EMAIL,
      clientId: process.env.OAUTH_CLIENTID,
      clientSecret: process.env.OAUTH_CLIENT_SECRET,
      refreshToken: process.env.OAUTH_REFRESH_TOKEN,
      accessToken: accessToken,
    },
  });

  const mailDetails = {
    from: process.env.CLIENT_G_EMAIL_FORMATED,
    to: to,
    subject: subject,
    html: html,
  };

  return new Promise(async (resolve, reject) => {
    mailTransporter.sendMail(mailDetails, function (err, data) {
      if (!err) {
        console.log('Email sent successfully');
        resolve(data);
      } else {
        console.log('Error :', err);
        reject(err);
      }
    });
  });
};

exports.renderTemplate = (name, vars = [], from = 'email_templates') => {
  var html = '';
  try {
    html = fs.readFileSync(`${__dirname}/../${from}/${name}.html`, 'utf8');
  } catch (e) {
    console.log('Error:', e.stack);
  }
  // replace templete vars
  vars.forEach((v, ind) => {
    html = html.replace(v[0], v[1]);
  });
  return html;
};

exports.renderTemplateV2 = (name, vars = [], folder = 'email_templates') => {
  var html = '';
  try {
    html = fs.readFileSync(`${__dirname}/../${folder}/${name}.html`, 'utf8');
  } catch (e) {
    console.log('Error:', e.stack);
  }
  // replace templete vars
  vars.forEach((v, ind) => {
    const reg = new RegExp(v[0], 'g');
    html = html.replace(reg, v[1]);
  });
  return html;
};
