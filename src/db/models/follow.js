exports.init = (mongoose) => {
  const Schema = mongoose.Schema;
  
  const schema = new Schema({
    user_id   : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    follow_id : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  
  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });

  return mongoose.model('Follow', schema);
};
