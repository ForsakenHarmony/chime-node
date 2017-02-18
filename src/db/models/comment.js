exports.init = (mongoose) => {
  const Schema = mongoose.Schema;
  
  const schema = new Schema({
    post      : { type: Schema.Types.ObjectId, ref: 'Post', required: true },
    user      : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    body      : { type: String, maxlength: 200, required: true },
    mentions  : { type: String, maxlength: 200 },
    hashtags  : { type: String, maxlength: 200 },
    urls      : { type: String, maxlength: 200 },
    likes     : [{ type: Schema.Types.ObjectId, ref: 'User' }],
    created_at: { type: Date, default: Date.now },
    updated_at: { type: Date, default: Date.now },
  });
  
  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });

  return mongoose.model('Comment', schema);
};
