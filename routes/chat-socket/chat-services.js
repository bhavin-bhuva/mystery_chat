const { Op } = require('sequelize');
const { handleEx } = require('../../helper/handle_ex');
const { Chat, User, sequelize } = require('../../models');
const events = require('./events');
const { page } = require('../../helper/pagination');

const getRecentUsers = async ({ userId, search }) => {
  return new Promise(async (resolve, reject) => {
    try {
      await sequelize
        .query(
          `
          SELECT 
            users.id, 
            users.first_name, 
            users.last_name, 
            users.email, 
            users.contact_number, 
            users.profile_url,
            chatsFromUsers.message, 
            chatsFromUsers.chat_id, 
            chatsFromUsers.created_at, 
            chatsFromUsers.updated_at, 
            chatsFromUsers.chat_id
          FROM 
            users 
            INNER JOIN (
              SELECT 
                DISTINCT ON(chatsfromAllUsers.id) id, 
                chatsfromAllUsers.message, 
                chatsfromAllUsers.chat_id, 
                chatsfromAllUsers.is_read, 
                chatsfromAllUsers.updated_at, 
                chatsfromAllUsers.created_at 
              FROM 
                (
                  SELECT 
                    * 
                  FROM 
                    (
                      SELECT 
                        chats.to_user_id AS id, 
                        chats.message, 
                        chats.id AS chat_id, 
                        chats.is_read, 
                        chats.updated_at, 
                        chats.created_at 
                      FROM 
                        chats 
                      WHERE 
                        chats.from_user_id = '${userId}' 
                        AND chats.to_user_id IS NOT NULL
                        AND chats.deleted_at IS NULL 
                      ORDER BY 
                        chats.created_at DESC
                    ) chatsToUsers 
                  UNION ALL 
                  SELECT 
                    * 
                  FROM 
                    (
                      SELECT 
                        chats.from_user_id AS id, 
                        chats.message, 
                        chats.id AS chat_id, 
                        chats.is_read, 
                        chats.updated_at, 
                        chats.created_at 
                      FROM 
                        chats 
                      WHERE 
                        chats.to_user_id = '${userId}' 
                        AND chats.from_user_id IS NOT NULL
                        AND chats.deleted_at IS NULL 
                      ORDER BY 
                        chats.created_at DESC
                    ) chatsFromUsers
                ) chatsfromAllUsers 
              ORDER BY 
                chatsfromAllUsers.id, 
                chatsfromAllUsers.created_at DESC
            ) chatsFromUsers ON chatsFromUsers.id = users.id 
          WHERE 
            (
              users.first_name ilike '%${search ? search : ''}%' 
              OR users.last_name ilike '%${search ? search : ''}%'
            )
          ORDER BY 
            chatsFromUsers.created_at desc
          `
        )
        .then((data) => resolve(data[0]))
        .catch((err) => reject(err));
    } catch (err) {
      reject(err);
    }
  });
};

const createChat = async (currentUser, payload) => {
  try {
    if (!payload || !payload.message || !payload.toUserId) {
      throw new Error('You must provid valid data');
    }

    const chatObj = {
      message: payload.message,
      toUserId: payload.toUserId,
      isRead: false,
      fromUserId: currentUser.id,
    };

    return new Promise(async (resolve, reject) => {
      await Chat.create(chatObj)
        .then((result) => resolve(result))
        .catch((err) => reject(err));
    });
  } catch (err) {
    throw new Error(err);
  }
};

const recentChat = async (currentUser, payload) => {
  try {
    const chatAtributes = ['id', 'message', 'createdAt', 'fromUserId', 'toUserId', 'isRead'];
    const chatWhere = {
      [Op.and]: [
        {
          [Op.or]: [{ fromUserId: currentUser.id }, { toUserId: currentUser.id }],
        },
        {
          [Op.or]: [{ fromUserId: payload.userId }, { toUserId: payload.userId }],
        },
      ],
    };

    const chatInclude = [
      {
        model: User,
        as: 'toUser',
        attributes: ['id', 'firstName', 'lastName'],
      },
      {
        model: User,
        as: 'fromUser',
        attributes: ['id', 'firstName', 'lastName'],
      },
    ];

    const chatOps = {
      attributes: chatAtributes,
      limit: page(payload).limit,
      offset: page(payload).offset,
      required: true,
      where: chatWhere,
      order: [['created_at', 'desc']],
      include: chatInclude,
    };

    return new Promise(async (resolve, reject) => {
      await Chat.findAll(chatOps)
        .then((chats) => resolve(chats))
        .catch((err) => reject(err));
    });
  } catch (err) {
    throw new Error(err);
  }
};

module.exports = {
  getRecentUsers,
  createChat,
  recentChat,
};
