const events = require('./events');
const chatService = require('./chat-services');
let users = [];

module.exports = (io) => (socket) => {
  socket.emit(
    events.SUCCESS,
    'Welcome to Myster Chat ! ' + socket.currentUser.firstName + ' ' + socket.currentUser.lastName
  );

  socket.on('connect', async () => {
    // find user and update socketId
    users.push({
      socketId: id,
      uid: socket.currentUser.id,
      firstName: socket.currentUser.firstName,
      lastName: socket.currentUser.lastName,
      contactNumber: socket.currentUser.contactNumber,
      email: socket.currentUser.email,
    });
    const index = users.findIndex((user) => user.uid === socket.data.user.id);
    if (index > -1) {
      users[index].socketId = socket.id;
    }

    socket.emit(events.RECONNCTED, {
      user: socket.currentUser.id,
      name: socket.currentUser.firstName + ' ' + socket.currentUser.lastName,
    });
  });

  socket.on('disconnect', async () => {
    const index = users.findIndex((user) => user.socketId === socket.id);
    if (index > -1) users.splice(index, 1);
    socket.emit(events.DISCONNECTED, {
      user: socket.currentUser.id,
      name: socket.currentUser.firstName + ' ' + socket.currentUser.lastName,
    });
  });

  for (let [id, socket] of io.of('/').sockets) {
    users.push({
      socketId: id,
      uid: socket.currentUser.id,
      firstName: socket.currentUser.firstName,
      lastName: socket.currentUser.lastName,
      contactNumber: socket.currentUser.contactNumber,
      email: socket.currentUser.email,
    });
  }

  socket.emit(events.ONLINE_USERS, users);

  socket.on(events.RECENT_CONNECTS, async (payload) => {
    try {
      await chatService
        .getRecentUsers({ userId: socket.currentUser.id, search: payload.search })
        .then(async (result) => {
          socket.emit(events.RECENT_CONNECTS, result);
        });
    } catch (err) {
      socket.emit(events.ERROR, new Error(err).message);
    }
  });

  socket.on(events.MESSAGE, async (payload) => {
    try {
      await chatService.createChat(socket.currentUser, payload).then(async (result) => {
        const oppositeUserSID = filterUsers(payload.toUserId).map((u) => u.socketId);
        socket.broadcast.to(oppositeUserSID).emit(events.MESSAGE, result);

        console.log('MESSAGE: ' + oppositeUserSID);

        // sending updated contact list
        await chatService.getRecentUsers({ userId: payload.toUserId }).then(async (result) => {
          socket.broadcast.to(oppositeUserSID).emit(events.RECENT_CONNECTS, result);
          console.log('RECENT_CONNECTS: ' + oppositeUserSID);
        });
      });
    } catch (err) {
      socket.emit(events.ERROR, new Error(err).message);
    }
  });

  socket.on(events.RECENT_CHATS, async (payload) => {
    try {
      await chatService.recentChat(socket.currentUser, payload).then(async (result) => {
        socket.emit(events.RECENT_CHATS, result);
      });
    } catch (err) {
      socket.emit(events.ERROR, new Error(err).message);
    }
  });

  const filterUsers = (match, field = 'uid') => {
    return users.filter((user) => user[field] === match);
  };
};
