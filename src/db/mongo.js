const mongoose = require('mongoose');
mongoose.Promise = global.Promise;

const model    = require('./model');

exports.init = (app) => {
  const models  = model.init(mongoose);
  
  mongoose.connect('localhost', 'chime');
  
  // app.context.db        = mongoose;
  app.context.db  = models;
};
