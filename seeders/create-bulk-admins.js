'use strict';

const bcrypt = require('bcryptjs');
module.exports = {
  up: async (queryInterface, Sequelize) => {
    const roleUser = await queryInterface.sequelize.query('SELECT * FROM "roles" WHERE name = ? limit 1', {
      replacements: ['user'],
      type: queryInterface.sequelize.QueryTypes.SELECT,
    });

    await queryInterface.bulkInsert(
      'users',
      [
        {
          first_name: 'Herman',
          last_name: 'Gomez',
          email: 'hermangomez@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Callie',
          last_name: 'Jones',
          email: 'callie@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Earl',
          last_name: 'Cross',
          email: 'earl@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Frances',
          last_name: 'Burns',
          email: 'frances@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Mario',
          last_name: 'Cox',
          email: 'mario@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Christine',
          last_name: 'Johnson',
          email: 'christine@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Adelaide',
          last_name: 'Sherman',
          email: 'adelaide@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          first_name: 'Hulda',
          last_name: 'Curtis',
          email: 'hulda@mysterychat.com',
          password: bcrypt.hashSync('sample', 10),
          role_id: roleUser[0].id || null,
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
