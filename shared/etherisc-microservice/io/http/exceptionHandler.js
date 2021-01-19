module.exports = async function exceptionHandler(ctx, next) {
  try {
    await next();
  } catch (err) {
    ctx.status = 500;
    console.log(err);
    if (process.env.NODE_ENV !== 'production') {
      ctx.body = ctx.body || { error: err.toString() };
    }

    ctx.app.emit('error', err, ctx);
  }
};
