const { handleEx } = require('../../helper/handle_ex');
const { sendEmail, renderTemplate } = require('../../helper/email');
const { validate } = require('../../helper/validator');
const { User } = require('../../models');
const moment = require('moment');

const passwordRule = {
  password: 'required',
  otp: 'required|numeric',
};

module.exports = async (req, res) => {
  validate(passwordRule, req.body, res);

  const { password, otp } = req.body;

  let user = await User.findOne({
    attributes: User.basicAttributes(),
    where: [{ reset_otp: otp.toString() }],
  });

  if (!user) return res.status(401).send({ message: 'Invalid details provided' });
  else {
    user.password = password;
    user.resetOtp = '';

    const html = renderTemplate('create_password', [
      ['{{clientName}}', process.env.CLIENT_NAME],
      ['{{userName}}', user.firstName + ' ' + user.lastName],
      ['{{user}}', user.firstName || user.lastName],
      ['{{address}}', process.env.CLIENT_ADDRESS],
    ]);

    user
      .save()
      .then(async (c) => {
        await sendEmail(user.email, 'Your PassWord Was Created', html);
        return res.status(202).send();
      })
      .catch((ex) => {
        error = handleEx(res, ex);
        return res.status(error.code).send(error.msg);
      });
  }
};
