exports.register = (ctx) => {
  ctx.body = 'registered';
};

exports.authorize = (ctx) => {
  ctx.body = 'authorized';
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
