const { v4: uuidv4 } = require('uuid');
const { Op } = require('sequelize');
const { handleEx } = require('../../helper/handle_ex');
const { User, Role, sequelize } = require('../../models');
const { validate } = require('../../helper/validator');
const { sendEmail, renderTemplate } = require('../../helper/email');
const moment = require('moment');
var fs = require('fs');

const postUserRule = {
  firstName: 'required|string',
  lastName: 'required|string',
  email: 'required|email',
  contactNumber: 'required|string',
  gender: 'required|string',
};

module.exports = async (req, res) => {
  const isValid = validate(postUserRule, req.body, res);
  if (!isValid) return;

  if (!['male', 'female', 'other'].includes(req.body.gender)) {
    return res.status(422).send({ message: 'Gender must be male, female or other' });
  }

  const userOps = req.body;
  userOps.email = userOps.email.toLowerCase();

  const t = await sequelize.transaction();
  try {
    userOps.email.toLowerCase();
    let getUser = await User.findOne({
      where: {
        email: { [Op.iLike]: userOps.email },
      },
    });

    if (getUser != null) {
      return res.status(400).json({ error: 'User already exists' });
    } else {
      const role = await Role.findOne({ where: { name: 'user' } });
      userOps.roleId = role.id;
      const user = await User.create(userOps, {
        transaction: t,
      });

      await t.commit();

      const findUser = await User.findOne({
        attributes: User.basicAttributes(),
        where: { id: user.id },
        include: [
          {
            model: Role,
            as: 'role',
            attributes: Role.basicAttributes(),
          },
        ],
      });

      const html = renderTemplate('invite', [
        ['{{clientName}}', process.env.CLIENT_NAME],
        ['{{userName}}', user.firstName + ' ' + user.lastName],
        ['{{user}}', user.firstName || user.lastName],
        ['{{address}}', process.env.CLIENT_ADDRESS],
      ]);

      await sendEmail(user.email, 'Your Account was Created', html);
      return res.json(findUser);
    }
  } catch (ex) {
    console.log(ex);
    // await t.rollback();
    error = handleEx(res, ex);
    return res.status(error.code).send(error.msg);
  }
};
