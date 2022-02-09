'use strict';
const { Model } = require('sequelize');
const moment = require('moment');
// moment().utcOffset('+05:30').format();

module.exports = (sequelize, DataTypes) => {
  class Notification extends Model {
    static allAttributes(arr = null) {
      let basicAttributesArr = ['id', 'title', 'discription', 'isRead', 'userId', 'createdAt', 'updatedAt'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static basicAttributes(arr = null) {
      let basicAttributesArr = ['id', 'title', 'discription', 'isRead', 'createdAt'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static associate(models) {
      Notification.User = Notification.belongsTo(models.User, {
        as: 'user',
        foreignKey: Notification.userId,
      });
    }
  }

  Notification.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sequelize.literal('uuid_generate_v4()') },
      title: { type: DataTypes.STRING, allowNull: false },
      discription: { type: DataTypes.STRING, allowNull: false },
      isRead: { type: DataTypes.BOOLEAN, defaultValue: false },
      userId: {
        type: DataTypes.UUID,
        references: { model: 'User', key: 'id' },
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      modelName: 'Notification',
      tableName: 'notifications',
    }
  );

  return Notification;
};
