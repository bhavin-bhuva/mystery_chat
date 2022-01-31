const { handleEx } = require('../../helper/handle_ex');
const { Notification } = require('../../models');
const { ERROR_MESSAGES } = require('../../helper/constants.json');

module.exports = async (req, res) => {
  try {
    const currentUser = res.locals.decoded.user;
    let whereOps = { id: req.params.id, userId: currentUser.id };
    await Notification.destroy({
      where: whereOps,
    })
      .then(async (notificatiom) => {
        if (notificatiom === 1) {
          res.status(200).json({ message: 'Removed successfully' });
        } else {
          res.status(422).send({ message: ERROR_MESSAGES.RECORD_NOT_FOUND });
        }
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
