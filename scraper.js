const playwright = require('playwright');

(async () => {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("http://areliajones.com");
    // await page.goto("https://schedule.sxsw.com/2024/search/film"); // TODO: Use current year
// code
console.log("this is wehre the magic happnes")
    await browser.close();
    // return result
})();