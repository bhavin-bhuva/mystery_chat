'use strict';

module.exports = {
  up: async (queryInterface, Sequelize) => {
    return Promise.all([
      await queryInterface.sequelize.query(`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`),
      await queryInterface.createTable('roles', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        name: {
          type: Sequelize.STRING,
          allownull: false,
          defaultValue: 'user',
        },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE },
      }),
      await queryInterface.createTable('users', {
        id: {
          primaryKey: true,
          type: Sequelize.UUID,
          defaultValue: Sequelize.literal('uuid_generate_v4()'),
        },
        first_name: { type: Sequelize.STRING, allownull: false },
        last_name: { type: Sequelize.STRING, allownull: true },
        email: { type: Sequelize.STRING },
        contact_number: { type: Sequelize.STRING },
        password: { type: Sequelize.STRING },
        reset_otp: { type: Sequelize.STRING },
        profle_url: { type: Sequelize.STRING },
        device_information: { type: Sequelize.JSONB },
        role_id: {
          type: Sequelize.UUID,
          onDelete: 'CASCADE',
          onUpdate: 'CASCADE',
          references: {
            model: {
              tableName: 'roles',
            },
            key: 'id',
            as: 'role_id',
          },
        },
        created_at: { type: Sequelize.DATE, allowNull: false },
        updated_at: { type: Sequelize.DATE, allowNull: false },
        deleted_at: { type: Sequelize.DATE },
      }),
    ]);
  },

  down: async (queryInterface, Sequelize) => {
    return Promise.all([await queryInterface.dropTable('users'), await queryInterface.dropTable('roles')]);
  },
};
