'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
// moment().utcOffset('+05:30').format();

module.exports = (sequelize, DataTypes) => {
  class Chat extends Model {
    static allAttributes(arr = null) {
      let basicAttributesArr = ['id', 'message', 'isRead', 'toUserId', 'createdAt', 'updatedAt'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static basicAttributes(arr = null) {
      let basicAttributesArr = ['id', 'message', 'isRead', 'createdAt'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static associate(models) {
      Chat.User = Chat.belongsTo(models.User, {
        as: 'toUser',
        foreignKey: Chat.toUserId,
      });
      Chat.User = Chat.belongsTo(models.User, {
        as: 'fromUser',
        foreignKey: Chat.fromUserId,
      });
    }
  }

  Chat.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sequelize.literal('uuid_generate_v4()') },
      message: { type: DataTypes.TEXT, allowNull: false },
      toUserId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      fromUserId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      modelName: 'Chat',
      tableName: 'chats',
    }
  );

  return Chat;
};
