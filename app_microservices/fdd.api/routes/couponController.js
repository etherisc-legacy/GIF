const moment = require('moment');
const { coupons, periods } = require('./../coupons');


module.exports = ({ router }) => {
  router.get('/api/coupons/:id', async (ctx) => {
    const { id } = ctx.params;

    if (coupons[id]) {
      const coupon = coupons[id];

      const exists = id === 'd1conf';

      const validPeriod = periods[id] ? moment(ctx.query.date).isBetween(periods[id].from, periods[id].to, null, '[]') : true;

      const response = Object.assign({ code: 'd1conf', exists: exists && validPeriod }, coupon);

      ctx.ok(response);
    } else {
      ctx.ok({ exists: false });
    }
  });
};
