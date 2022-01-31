const jwt = require('jsonwebtoken');
const { Op } = require('sequelize');
const bcrypt = require('bcryptjs');
const { validate } = require('../../helper/validator');
const { User, Role, UserToken } = require('../../models');
const { ENUMS } = require('../../helper/constants.json');

const loginRule = {
  email: 'required|email',
  password: 'required',
};

module.exports = async (req, res) => {
  try {
    const isValid = validate(loginRule, req.body, res);
    if (!isValid) return;

    const { email, password } = req.body;

    let user = await User.findOne({
      attributes: User.allAttributes(),
      where: [{ email: { [Op.like]: email.toLowerCase() } }],
      include: [
        {
          model: Role,
          as: 'role',
          attributes: Role.allAttributes(),
        },
      ],
    });

    if (!user) res.status(401).send({ message: 'User Not Found' });
    else {
      if (user.password) {
        const match = bcrypt.compare(password, user.password || false);
        if (!match) return res.status(401).send({ message: 'Unauthenticated' });
      } else {
        return res.status(401).send({ message: 'Unauthenticated' });
      }

      //saving deviceInformation
      if (req.body.deviceInformation && typeof req.body.deviceInformation === 'object') {
        user.deviceInformation = req.body.deviceInformation;
        await user.save();
      }

      //saving notification token
      if (req.body.token && typeof req.body.token === 'object') {
        const check_token = await UserToken.findOne({
          where: { userId: user.id },
        });

        if (check_token) {
          check_token.token = JSON.stringify(req.body.token);
          await check_token.save();
        } else {
          await UserToken.create({
            type: ENUMS.TOKEN_TYPE.ANDROID,
            token: JSON.stringify(req.body.token),
            userId: user.id,
          });
        }
      }

      delete user.dataValues.password;
      delete user.dataValues.resetOtp;
      delete user.dataValues.role.dataValues.createdAt;
      delete user.dataValues.role.dataValues.updatedAt;

      const tokenData = user.toJSON();
      const token = jwt.sign(tokenData, process.env.JWT);
      return res.json({ user: user, token: token });
    }
  } catch (err) {
    console.log(err);
    return res.status(500).send(err);
  }
};
