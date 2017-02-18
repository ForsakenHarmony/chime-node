const polymorphic = require('mongoose-polymorphic');

exports.init = (mongoose) => {
  const Schema = mongoose.Schema;
  
  const schema = new Schema({
    user         : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    // likeable_id  : { type: String, required: true }, // TODO
    // likeable_type: { type: String, required: true, maxlength: 32 },
    created_at   : { type: Date, default: Date.now },
    updated_at   : { type: Date, default: Date.now },
  });
  
  schema.plugin(polymorphic, {
    associationKey: 'likeable',
    promise       : global.Promise,
    required      : true
  });
  
  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });
  
  return mongoose.model('Like', schema);
};