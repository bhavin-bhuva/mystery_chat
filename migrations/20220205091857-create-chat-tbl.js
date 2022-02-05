'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.createTable('chats', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        message: { type: Sequelize.TEXT, allowNull: false },
        to_user_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id',
            as: 'to_user_id',
          },
        },
        from_user_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: {
              tableName: 'users',
            },
            key: 'id',
            as: 'from_user_id',
          },
        },
        is_read: { type: Sequelize.BOOLEAN, defaultValue: false },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE },
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([await queryInterface.dropTable('chats')]);
  },
};
