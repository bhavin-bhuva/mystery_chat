'use strict';

const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const role = await queryInterface.bulkInsert(
      'roles',
      [
        {
          name: 'admin',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'user',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      { returning: true }
    );
    let roleId = null;

    for (const roleElement of role) {
      if (roleElement.name == 'admin') {
        roleId = roleElement.id;
      }
    }

    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'admin',
          last_name: 'admin',
          email: 'admin@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleId || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  down: async (queryInterface, Sequelize) => {
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
