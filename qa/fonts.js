// QA network policy: the fonts travel inside the page (build.mjs inlines them), so every outside request is blocked.
async function installRoutes(page) {
  await page.route(/^https?:\/\//, r => r.abort());
}
module.exports = { installRoutes };
