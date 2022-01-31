const { Op } = require('sequelize');
const { handleEx } = require('../../helper/handle_ex');
const { User, Role } = require('../../models');
const { searchQuery } = require('../../helper/search_query');
const { page } = require('../../helper/pagination');

module.exports = async (req, res) => {
  let whereOps = {};
  const currentUser = res.locals.decoded.user;

  if (req.query.search) {
    whereOps = {
      [Op.and]: [
        {
          [Op.or]: [
            { firstName: searchQuery(req.query.search) },
            { lastName: searchQuery(req.query.search) },
            { email: searchQuery(req.query.search) },
            { contactNumber: searchQuery(req.query.search) },
          ],
        },
      ],
    };
  } else {
    whereOps = {
      id: { [Op.ne]: currentUser.id },
    };
  }

  //init sorting
  const sortArrDefault = ['firstName', 'lastName', 'email', 'contactNumber', 'updatedAt'];

  let sortArr;
  let sortOrder = req.query.order ? req.query.order : 'DESC';
  if (req.query.sortBy) {
    if (!sortArrDefault.includes(req.query.sortBy)) {
      return res.status(422).send({ error: 'invalid sortBy params' });
    }
    sortArr = [[req.query.sortBy, sortOrder]];
  } else {
    sortArr = [['updatedAt', 'DESC']];
  }

  User.findAndCountAll({
    attributes: User.basicAttributes(),
    where: whereOps,
    order: sortArr,
    limit: page(req.query).limit,
    offset: page(req.query).offset,
    include: [
      {
        model: Role,
        as: 'role',
        attributes: Role.basicAttributes(),
      },
    ],
  })
    .then((user) => res.send(user))
    .catch((ex) => {
      error = handleEx(res, ex);
      return res.status(error.code).send(error.msg);
    });
};
