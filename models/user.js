'use strict';
const { Model } = require('sequelize');
const bcrypt = require('bcryptjs');
module.exports = (sequelize, DataTypes) => {
  class User extends Model {
    static basicAttributes(arr = null) {
      let basicAttributesArr = ['id', 'firstName', 'lastName', 'email', 'createdAt', 'updatedAt', 'contactNumber'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static allAttributes(arr = null) {
      let basicAttributesArr = [
        'id',
        'firstName',
        'lastName',
        'email',
        'contactNumber',
        'password',
        'resetOtp',
        'createdAt',
        'updatedAt',
        'deviceInformation',
        'roleId',
      ];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static associate(models) {
      User.Role = User.belongsTo(models.Role, {
        as: 'role',
        foreignKey: User.roleId,
      });
    }
  }

  User.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sequelize.literal('uuid_generate_v4()') },
      firstName: { type: DataTypes.STRING, allowNull: false },
      lastName: { type: DataTypes.STRING, allowNull: true },
      email: { type: DataTypes.STRING, allowNull: false },
      contactNumber: { type: DataTypes.STRING },
      profileUrl: { type: DataTypes.STRING },
      password: {
        type: DataTypes.STRING,
        set(value) {
          if (value) this.setDataValue('password', bcrypt.hashSync(value, 10));
        },
      },
      resetOtp: { type: DataTypes.STRING },
      deviceInformation: { type: DataTypes.JSONB },
      roleId: {
        type: DataTypes.UUID,
        references: { model: 'Role', key: 'id' },
      },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      modelName: 'User',
      tableName: 'users',
    }
  );

  return User;
};
