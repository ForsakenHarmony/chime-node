// TODO: entities maybe as an object

exports.init = (mongoose, app) => {
  const user    = require('./models/user').init(mongoose);
  const token   = require('./models/token').init(mongoose, app.context.secret);// TODO
  const post    = require('./models/post').init(mongoose);
  const comment = require('./models/comment').init(mongoose);
  const follow  = require('./models/follow').init(mongoose);
  const like    = require('./models/like').init(mongoose);
  
  return {
    user,
    token,
    post,
    comment,
    follow,
    like,
  };
};
