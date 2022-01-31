const FCM = require('fcm-node');
const { Op } = require('sequelize');

const { UserToken, Notification, sequelize } = require('../models');

const sendPushNotification = async (to, title, body) => {
  let serverKey = process.env.FCM_SERVER_KEY; //put the generated private key path here
  const fcm = new FCM(serverKey);
  const message = {
    registration_ids: to,
    notification: {
      title,
      body,
    },
    apns: {
      payload: {
        aps: {
          alert: {
            title,
            body,
          },
        },
      },
    },
  };

  await fcm.send(message, function (err, response) {
    if (err) {
      console.log(err);
      return Promise.reject(false);
    } else {
      console.log(response);
      return Promise.resolve(true);
    }
  });
};

exports.createNotification = async ({ title, body, currentUser }) => {
  const userTokens = await UserToken.findAll({
    where: { user_id: { [Op.ne]: currentUser.id } },
    group: ['UserToken.token', 'UserToken.id'],
    raw: true,
  });

  const toTokens = [];
  const notificationArray = [];

  for (const tokens of userTokens) {
    const token = JSON.parse(tokens.token).pushToken;
    notificationArray.push({
      title,
      discription: body,
      userId: tokens.userId,
    });
    toTokens.push(token);
  }

  await Notification.bulkCreate(notificationArray)
    .then(async () => {
      await sendPushNotification(toTokens, title, body);
      return Promise.resolve(true);
    })
    .catch((err) => {
      console.log(err);
      return Promise.reject(false);
    });
};
