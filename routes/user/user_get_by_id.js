const { handleEx } = require('../../helper/handle_ex');
const { User, Role } = require('../../models');

module.exports = async (req, res) => {
  User.findOne({
    attributes: User.basicAttributes(),
    where: { id: req.params.id },
    include: [
      {
        model: Role,
        as: 'role',
        attributes: Role.basicAttributes(),
      },
    ],
  })
    .then((user) => {
      if (user) {
        return res.status(200).send(user);
      } else {
        return res.status(422).send({ error: 'No data Found' });
      }
    })
    .catch((ex) => {
      error = handleEx(res, ex);
      return res.status(error.code).send(error.msg);
    });
};
