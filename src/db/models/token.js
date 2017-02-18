const jwt = require('jsonwebtoken');

exports.init = (mongoose, secret) => {
  const Schema = mongoose.Schema;
  
  // Access Levels: (1) Read (2) Read/Write (3) Read/Write/Account
  const schema = new Schema({
    token       : { type: String, maxlength: 32, required: true },
    user        : { type: Schema.Types.ObjectId, ref: 'User', required: true },
    description : { type: String, maxlength: 256 },
    access_level: {
      type   : Number,
      get    : v => Math.round(v),
      set    : v => Math.round(v),
      default: 1
    },
    created_ip  : { type: String, maxlength: 32 },
    created_at  : { type: Date, default: Date.now },
    updated_at  : { type: Date, default: Date.now },
  });
  
  schema.pre('save', function (next) {
    this.updated_at = Date.now();
    next();
  });
  
  schema.methods.generateJWT = async function (user, description, access_level) {
    let self = this;
    return new Promise((res, rej) => {
      const tokenid = 'okokok';
      
      const data = {
        iat : Date.now(),
        jti : tokenid,
        data: {
          _id     : user._id,
          username: user.username,
          description,
          access_level,
        }
      };
      
      const token = jwt.sign(data, secret, { algorithm: 'HS512' }, function (err, token) {
        if (err) rej(err);
        res({ id: tokenid, token })
      });
    });
  };
  
  schema.methods.verifyJWT = async function (token) {
    return new Promise((res, rej) => {
      jwt.verify(token, secret, function (err, decoded) {
        if (err) rej(err);
        res(decoded);
      })
    });
  };
  
  return mongoose.model('Token', schema);
};