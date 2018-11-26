import scrolling from './drag-scrolling';
import Searcher from './searcher';

const API_KEY = 'AIzaSyDKFdjQWFmuR2tQpdvWVANr4XUbGI4_GkI';
const searcher = new Searcher(API_KEY);

function createVideoComponent(video) {
  const {
    channelTitle, videoTitle, description, image, views, publishedAt, link,
  } = video;


  const publishDate = new Date(publishedAt);
  const monthNames = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun',
    'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec',
  ];
  const day = document.createElement('span');
  day.className = 'date';
  day.innerHTML = `${publishDate.getDate()} `;
  const month = document.createElement('span');
  month.className = 'month';
  month.innerHTML = `${monthNames[publishDate.getMonth()]} `;
  const year = document.createElement('span');
  year.className = 'year';
  year.innerHTML = `${publishDate.getFullYear()}`;
  const date = document.createElement('div');
  date.className = 'date';
  date.appendChild(day);
  date.appendChild(month);
  date.appendChild(year);

  const liContent1 = document.createElement('li');
  const aContent1 = document.createElement('a');
  const spanContent1 = document.createElement('span');
  spanContent1.innerHTML = views;
  aContent1.appendChild(spanContent1);
  liContent1.appendChild(aContent1);
  aContent1.className = 'fa fa-eye';
  aContent1.href = '#';


  const menuContent = document.createElement('ul');
  menuContent.className = 'menu-content';
  menuContent.appendChild(liContent1);


  const header = document.createElement('div');
  header.className = 'header';
  header.appendChild(date);
  header.appendChild(menuContent);


  const author = document.createElement('span');
  author.className = 'author';
  author.innerHTML = channelTitle;

  const title = document.createElement('h1');
  title.className = 'title';
  const titleA = document.createElement('a');
  titleA.innerHTML = videoTitle.slice(0, 25);
  title.appendChild(titleA);

  const text = document.createElement('p');
  text.className = 'text';
  text.innerHTML = description.slice(0, 120);

  const button = document.createElement('a');
  button.className = 'button';
  button.innerHTML = 'View video';
  button.href = link;


  const content = document.createElement('div');
  content.className = 'content';
  content.appendChild(author);
  content.appendChild(title);
  content.appendChild(text);
  content.appendChild(button);

  const data = document.createElement('div');
  data.className = 'data';
  data.appendChild(content);

  const wrapper = document.createElement('div');
  wrapper.className = 'wrapper';
  wrapper.style.background = `url('${image}') center / contain no-repeat`;
  wrapper.style.backgroundSize = 'cover';
  wrapper.style.backgroundPosition = 'center';
  wrapper.appendChild(header);
  wrapper.appendChild(data);


  const cardWrap = document.createElement('div');
  cardWrap.className = 'example-2 card';
  cardWrap.appendChild(wrapper);

  return cardWrap;
}

function renderVideos(videos) {
  let cardsWrapper;
  if (document.querySelector('.cards-wrapper')) {
    cardsWrapper = document.querySelector('.cards-wrapper');
  } else {
    cardsWrapper = document.createElement('div');
    cardsWrapper.className = 'cards-wrapper slider row';
    document.querySelector('.app-wrapper').appendChild(cardsWrapper);
  }
  scrolling.startHandlingScroll();

  while (cardsWrapper.firstChild) {
    cardsWrapper.removeChild(cardsWrapper.firstChild);
  }

  videos.forEach((e) => {
    cardsWrapper.appendChild(createVideoComponent(e));
  });
  document.querySelector('.app-wrapper').appendChild(cardsWrapper);
}

function search(q) {
  const videos = [];
  return new Promise((resolve) => {
    searcher.getVideosInfo(q)
      .then((result) => {
        result.forEach((e) => {
          videos.push(
            {
              channelTitle: e.snippet.channelTitle || '',
              videoTitle: e.snippet.localized.title || '',
              description: e.snippet.description || '',
              image: e.snippet.thumbnails.high.url || '',
              publishedAt: e.snippet.publishedAt,
              views: e.statistics.viewCount,
              link: `https://www.youtube.com/watch?v=${e.id}`,
            },
          );
        });
        resolve(videos);
      });
  });
}

function init() {
  const appWrapper = document.createElement('div');
  appWrapper.className = 'app-wrapper';

  const searchInput = document.createElement('input');
  searchInput.className = 'search-input form__field';
  searchInput.placeholder = 'Search videos...';
  searchInput.value = 'LION KING';

  const searchButton = document.createElement('button');
  searchButton.className = 'search-button btn btn--primary btn--inside uppercase';
  searchButton.innerHTML = 'Search';

  const searchWrap = document.createElement('div');
  searchWrap.className = 'search-wrap';
  searchWrap.appendChild(searchInput);
  searchWrap.appendChild(searchButton);

  appWrapper.appendChild(searchWrap);


  searchButton.addEventListener('click', () => {
    const query = searchInput.value;
    search(query).then((videos) => {
      renderVideos(videos);
    });
  });
  searchWrap.addEventListener('keypress', (e) => {
    const key = e.which;
    if (key === 13) {
      const query = searchInput.value;
      search(query).then((videos) => {
        renderVideos(videos);
      });
    }
  });
  document.body.appendChild(appWrapper);
}

init();
