
module.exports = ({ router, versionService }) => {
  router.get('/api/appVersion', async (ctx) => {
    const appVersion = await versionService.retrieveAppVersion();
    ctx.ok(appVersion);
  });
};
