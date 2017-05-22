const polymorphic = require('mongoose-polymorphic');

exports.init = (mongoose) => {
  const Schema = mongoose.Schema;
  
  const schema = new Schema({
    user      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    notifier  : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    type      : { type: String, maxlength: 32, required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  
  schema.plugin(polymorphic, {
    associationKey: 'object',
    promise       : global.Promise,
    required      : true
  });
  
  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });
  
  return mongoose.model('Notifications', schema);
};