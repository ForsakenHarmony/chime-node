const mongoose   = require('mongoose');
mongoose.Promise = global.Promise;
const config     = require.main.require('./config');

const models = require('./models');

mongoose.connect(config.mongoHost, 'chime');

module.exports = {
  mongoose,
  User        : models.User,
  Token       : models.Token,
  Comment     : models.Comment,
  Like        : models.Like,
  Notification: models.Notification,
  Post        : models.Post,
};
