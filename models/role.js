'use strict';
const { Model } = require('sequelize');
module.exports = (sequelize, DataTypes) => {
  class Role extends Model {
    static allAttributes(arr = null) {
      let basicAttributesArr = ['id', 'name', 'createdAt', 'updatedAt'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
    static basicAttributes(arr = null) {
      let basicAttributesArr = ['id', 'name'];

      return arr ? basicAttributesArr.concat(arr) : basicAttributesArr;
    }
  }

  Role.init(
    {
      id: { type: DataTypes.UUID, primaryKey: true, defaultValue: sequelize.literal('uuid_generate_v4()') },
      name: { type: DataTypes.STRING, allowNull: false },
    },
    {
      sequelize,
      underscored: true,
      paranoid: true,
      modelName: 'Role',
      tableName: 'roles',
    }
  );

  return Role;
};
