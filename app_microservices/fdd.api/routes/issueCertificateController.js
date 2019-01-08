
module.exports = ({ router }) => {
  router.get('/issue-certificate/:id', async (ctx) => {
    // todo: replace with certificate certificate from dip_pdf_generator
    ctx.ok();
  });
};
