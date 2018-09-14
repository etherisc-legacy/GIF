module.exports =  (router, mq) => {
    router.get('/', async (ctx, next) => {
        ctx.state = {
            title: 'DIP Test Microservice',
        };
        await ctx.render('index', ctx.state)
    });

    router.post('/message', async (ctx, next) => {
        const { message } = ctx.request.body;
        mq.publish(message);
        ctx.redirect('/');
    });
};



