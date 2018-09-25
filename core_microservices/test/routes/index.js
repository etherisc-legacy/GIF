module.exports = (router, mq) => {
  router.get('/', async (ctx) => {
    ctx.state = {
      title: 'DIP Test Microservice',
    };
    await ctx.render('index', ctx.state);
  });

  router.post('/message', async (ctx) => {
    const { message } = ctx.request.body;
    mq.publish(message);
    ctx.redirect('/');
  });
};
