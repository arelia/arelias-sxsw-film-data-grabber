const playwright = require('playwright');

let movieHash = []

function getMovieInfo(listItem) {
    let title = listItem.querySelector('h5 a') ? listItem.querySelector('h5 a').innerText.replaceAll('"', '') : ""
    let url = listItem.querySelector('a') ? listItem.querySelector('a').href : ""
    let category = listItem.querySelector('.badge-split-film-category .badge-content') ? listItem.querySelector('.badge-split-film-category .badge-content').innerText : ""
    let genres = listItem.querySelector('.badge-split-film-genre .badge-content') ? listItem.querySelector('.badge-split-film-genre .badge-content').innerText.replaceAll(',', ' | ') : ""
    let section = listItem.querySelector('.badge-split-film-section .badge-content') ? listItem.querySelector('.badge-split-film-section .badge-content').innerText.replaceAll(',', ' | ') : ""
    let premiere = listItem.querySelector('.badge-split-film-premiere .badge-content') ? listItem.querySelector('.badge-split-film-premiere .badge-content').innerText.replaceAll(',', ' | ') : ""
    let director = listItem.querySelector('.badge-split-director .badge-content') ? listItem.querySelector('.badge-split-director .badge-content').innerText.replaceAll(',', ' | ') : ""
    let image_url = listItem.querySelector('.er-event-image img').src ? listItem.querySelector('.er-event-image img').src : ""

    let hash = {
        'title': title,
        'url': url,
        'category': category,
        'genres': genres,
        'section': section,
        'premiere': premiere,
        'director': director,
        'image_url': image_url,
    };
    movieHash.push(hash);
}

function convertToJson(hash) {
    let json = hash
    let fields = Object.keys(json[0])
    let replacer = function (key, value) { return value === null ? '' : value }
    let csv = json.map(function (row) {
        return fields.map(function (fieldName) {
            return JSON.stringify(row[fieldName], replacer)
        }).join(',')
    })
    csv.unshift(fields.join(',')) // add header column
    csv = csv.join('\r\n');
    copy(csv)
    console.log(csv)
}

(async () => {
    const browser = await playwright.chromium.launch({ headless: true });
    const context = await browser.newContext();
    const page = await context.newPage();
    await page.goto("https://schedule.sxsw.com/2024/search/film"); // TODO: Use current year

    let movieNodes = page.querySelectorAll('.er-content-container')
    

    // populate movieHash
    movieNodes.forEach(node => getMovieInfo(node))

    convertToJson(movieHash)

console.log("this is wehre the magic happnes")
    await browser.close(); // TODO: close earlier?
    // return result
})();