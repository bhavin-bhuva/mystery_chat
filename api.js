const routes = require('express').Router();
const { isAdmin } = require('./middelwares/isAdmin');
const { filesUpload } = require('./middelwares/base64_upload');

//auth
routes.post(`/auth/login`, require('./routes/auth/auth_login'));
routes.put(`/auth/password`, require('./routes/auth/auth_create_password'));
routes.put(`/auth/resetpassword`, require('./routes/auth/auth_reset_password'));

//user
routes.post(`/user/register`, require('./routes/user/user_create'));
routes.get(`/user/:id(\\d+)/`, isAdmin(), require('./routes/user/user_get_by_id'));
routes.get(`/user`, isAdmin(), require('./routes/user/user_get_all'));
routes.put(`/user`, filesUpload, require('./routes/user/user_update'));

//notification
routes.get(`/notification`, require('./routes/notification/notification_list'));
routes.delete(`/notification/:id(\\d+)/`, require('./routes/notification/notification_delete'));

module.exports = routes;
