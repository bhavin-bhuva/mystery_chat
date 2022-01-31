const { Op } = require('sequelize');
const { handleEx } = require('../../helper/handle_ex');
const { Notification, sequelize } = require('../../models');
const { page } = require('../../helper/pagination');

module.exports = async (req, res) => {
  try {
    const currentUser = res.locals.decoded.user;
    await Notification.findAndCountAll({
      where: { userId: currentUser.id },
      attributes: Notification.basicAttributes(),
      limit: page(req.query).limit,
      offset: page(req.query).offset,
    })
      .then(async (noficationList) => {
        // mark all chat read
        await Notification.update({ isRead: true }, { where: { userId: currentUser.id, isRead: false } })
          .then(function (rowsUpdated) {
            // console.log("marked as read", rowsUpdated);
          })
          .catch((e) => console.log('ERR', e));

        return res.json(noficationList);
      })
      .catch((ex) => {
        error = handleEx(res, ex);
        return res.status(error.code).send(error.msg);
      });
  } catch (ex) {
    error = handleEx(res, ex);
    return res.status(error.code).send(error.msg);
  }
};
