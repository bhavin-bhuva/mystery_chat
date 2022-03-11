const express = require('express');
const jwt = require('express-jwt');
const { corsmw } = require('./middelwares/corsmw');
require('dotenv').config();
const app = express();
const port = process.env.PORT || 3000;
var server = require('http').Server(app);
const io = require('socket.io')(server);
const socketManage = require('./routes/chat-socket/socketManage')(io);
const jwtSocket = require('jsonwebtoken');

const publicRoutes = [/\/auth\/*/, '/user/register'];

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

io.use(function (socket, next) {
  if (socket.handshake.auth.token) {
    jwtSocket.verify(socket.handshake.auth.token, process.env.JWT, function (err, decoded) {
      if (err) return next(new Error('Authentication error'));
      socket.currentUser = decoded;
      next();
    });
  } else {
    next(new Error('Authentication error'));
  }
}).on('connection', socketManage);

app.use(
  jwt({
    secret: process.env.JWT,
    algorithms: ['HS256'],
    resultProperty: 'locals.decoded.user',
  }).unless({ path: publicRoutes })
);

app.use((err, req, res, next) => {
  if (err.name === 'UnauthorizedError') {
    res.header('Access-Control-Allow-Origin', '*');
    res.status(401).send({
      status: 401,
      errorCode: 'TOKEN_EXPIRED',
      error: 'Unauthorized',
    });
  } else {
    next(err);
  }
});

app.use('/', corsmw, require('./api'));
if (process.env.NODE_ENV == 'local') {
  server.listen(port, () => {
    console.log(`Server listening on \nURL -> http://localhost:${port}`);
  });
} else {
  server.listen(port, () => {
    console.log(`Server listening on \nURL -> http://localhost:${port}`);
  });
}
module.exports = app;
