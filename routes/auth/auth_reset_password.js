const { handleEx } = require('../../helper/handle_ex');
const { sendEmail, renderTemplate } = require('../../helper/email');
const { validate } = require('../../helper/validator');
const { User } = require('../../models');
var otpGenerator = require('otp-generator');
const moment = require('moment');

const resetPasswordRule = {
  email: 'required|email',
};

module.exports = async (req, res) => {
  const isValid = validate(resetPasswordRule, req.body, res);
  if (!isValid) return;

  const { email } = req.body;
  let user = await User.findOne({
    attributes: User.allAttributes(),
    where: [{ email: email }],
  });

  if (!user) res.status(422).send({ error: 'Invalid details provided' });
  else {
    const OTP = otpGenerator.generate(6, {
      digits: true,
      alphabets: false,
      specialChars: false,
      upperCase: false,
    });
    // const OTP_EXP = OTP + "|" + moment().add(7, "days").unix();
    user.password = '';
    user.resetOtp = OTP;

    const html = renderTemplate('password_reset', [
      ['{{clientName}}', process.env.CLIENT_NAME],
      ['{{userName}}', user.firstName + ' ' + user.lastName],
      ['{{user}}', user.firstName || user.lastName],
      ['{{otp}}', `${user.resetOtp}`],
      ['{{address}}', process.env.CLIENT_ADDRESS],
    ]);

    user
      .save()
      .then(async (c) => {
        await sendEmail(user.email, 'Password reset requested', html);
        return res.status(202).send();
      })
      .catch((ex) => {
        error = handleEx(res, ex);
        return res.status(error.code).send(error.msg);
      });
  }
};
