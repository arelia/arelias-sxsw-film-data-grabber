// const movieList = document.querySelectorAll('a[href^="http://schedule.sxsw.com/2022/films"]')

// let movieHash = []

// for(let element of movieList){
//     let hash = {'title': element.text, 'url': element.href}
//     movieHash.push(hash)
// }

// copy(movieHash)

// // ====================================

// let movieHash = []

// const genreList = document.querySelectorAll('header h1')

// genreList.forEach(genre => 
//   let genreName = genre.innerText;
//   let genreSection = genre.closest('section');
//   let movieList = genreSection.querySelectorAll('a[href^="http://schedule.sxsw.com/2023/films"]');

//   for(let element of movieList){
//     let hash = {'category': genreName, 'title': element.text, 'url': element.href};
//     movieHash.push(hash);
//   }
// )

// copy(movieHash)

// from https://schedule.sxsw.com/2023/films

let movieNodes = document.querySelectorAll('.er-content-container')
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

// populate movieHash
movieNodes.forEach(node => getMovieInfo(node))

// copy(movieHash)

let json = movieHash
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
