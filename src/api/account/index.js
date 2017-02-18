exports.register = async (ctx) => {
  const body = ctx.request.body;
  
  if (Object.keys(body).length === 0) {
    ctx.body = { message: 'Request body must be valid JSON' };
    return;
  }
  
  const user = new ctx.db.user(body);
  
  try {
    await user.save();
  } catch (err) {
    if (err.name === 'ValidationError') {
      Object.keys(err.errors).map((e) => {
        err.errors[e] = err.errors[e].message;
      });
      ctx.body = { message: 'Account creation failed, see errors', error: err.errors };
    } else if (err.code === 11000) {
      ctx.body = { message: 'Username is already taken, try another' };
    } else {
      ctx.body = { message: 'Account creation failed, see errors', error: err };
    }
    return;
  }
  
  ctx.body = { message: 'Account created, you can now start using your account' };
};

exports.authorize = async (ctx) => {
  const body = ctx.request.body;
  
  if (Object.keys(ctx.request.body).length === 0) {
    return ctx.body = { message: 'Request body must be valid JSON' };
  }
  
  if (!body.username || !body.password) {
    return ctx.body = { message: 'You must provide username/password' };
  }
  
  let user;
  
  try {
    user = await ctx.db.user.findOne({ username: body.username });
  } catch (err) {
    console.error(err);
    ctx.body = { message: 'Authorization failed, see error', error: err };
    return;
  }
  
  if (!user) {
    return ctx.body = { message: 'Authorization failed, username/password incorrect' };
  }
  
  try {
    if (!await user.compare(body.password)) {
      return ctx.body = { message: 'Authorization failed, username/password incorrect' };
    }
  } catch (err) {
    console.error(err);
    return ctx.body = { message: 'Authorization failed, see error', error: err };
  }
  
  const token = new ctx.db.token({
    description : body.password,
    access_level: body.access_level,
    token       : 'somerandomtokenig',
    user,
  });
  
  try {
    await token.validate();
  } catch (err) {
    console.error(err);
    return ctx.body = { message: 'Authorization failed, see error', error: err };
  }
  
  const jwt = await token.generateJWT(user, token.description, token.access_level);
  
  token.token = jwt.token;
  
  try {
    await token.save();
  } catch (err) {
    console.error(err);
    return ctx.body = { message: 'Authorization failed, see error', error: err };
  }
  
  ctx.body = {
    message     : 'Authorization successful, access token granted',
    access_token: jwt
  };
};

exports.update_profile = (ctx) => {
  ctx.body = 'update profile';
};

exports.tokens = (ctx) => {
  ctx.body = 'tokens';
};

exports.delete_token = (ctx) => {
  ctx.body = 'delete token';
};
