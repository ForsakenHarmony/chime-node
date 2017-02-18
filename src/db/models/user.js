const bcrypt = require('bcrypt');

// TODO: Bettter validation
// const validate = require('mongoose-validator');

exports.init = (mongoose) => {
  const Schema = mongoose.Schema;
  
  const schema = new Schema({
    username          : { type: String, required: true, maxlength: 32, unique: true },
    name              : { type: String, required: true, maxlength: 100 },
    email             : { type: String, required: true, maxlength: 256 },
    password          : { type: String, required: true },
    verified          : { type: Boolean, default: false },
    suspended         : { type: Boolean, default: false },
    bio               : { type: String, maxlength: 200 },
    website           : { type: String, maxlength: 256 },
    location          : { type: String, maxlength: 32 },
    color             : { type: String, maxlength: 6 },
    two_factor_enabled: { type: String, maxlength: 32 },
    created_at        : { type: Date, default: Date.now },
    updated_at        : { type: Date, default: Date.now },
  });
  
  schema.pre('save', function (next) {
    let self        = this;
    self.updated_at = Date.now();
    
    if (!self.isModified()) {
      return next();
    }
    
    bcrypt.hash(self.password, 10, (err, hash) => {
      if (err) return next();
      self.password = hash;
      next();
    });
  });
  
  schema.methods.hash = async (pass) => {
    return await bcrypt.hash(pass, 10);
  };
  
  schema.methods.compare = async function (pass) {
    return await bcrypt.compare(pass, this.password);
  };
  
  return mongoose.model('User', schema);
};