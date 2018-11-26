module.exports = class Searcher {
  constructor(KEY) {
    this.API_KEY = KEY;
    this.SearchURL = 'https://www.googleapis.com/youtube/v3/search?';
    this.VideoURL = 'https://www.googleapis.com/youtube/v3/videos?';
  }


  static createUrl(objects, url) {
    let newUrl = `${url}`;
    Object.keys(objects).forEach((key) => {
      if (objects[key]) {
        newUrl += `${key}=${objects[key]}&`;
      }
    });
    return newUrl.substring(0, newUrl.length - 1);
  }

  getIds(q) {
    const KEY = this.API_KEY;
    const SearchObjects = {
      part: 'snippet',
      maxResults: '25',
      q,
      key: KEY,
    };

    return new Promise((res) => {
      const xmlhttp = new XMLHttpRequest();
      xmlhttp.onreadystatechange = function () {
        if (this.readyState === 4 && this.status === 200) {
          const myArr = JSON.parse(this.responseText);
          res(myArr);
        }
      };
      xmlhttp.open('GET', Searcher.createUrl(SearchObjects, this.SearchURL), true);
      xmlhttp.send();
    });
  }

  getVideosInfo(q) {
    const KEY = this.API_KEY;
    const VideoObjects = {
      part: 'snippet,statistics',
      maxResults: '25',
      key: KEY,
      id: null,
    };

    return new Promise((resolve, reject) => {
      this.getIds(q)
        .then((result) => {
          VideoObjects.id = result.items.map(e => e.id).map(e => e.videoId).join();
          const xmlhttp = new XMLHttpRequest();
          xmlhttp.onreadystatechange = function () {
            if (this.readyState === 4 && this.status === 200) {
              const myArr = JSON.parse(this.responseText);
              resolve(myArr.items);
            }
          };
          xmlhttp.onerror = () => {
            reject(this.status);
          };
          xmlhttp.open('GET', Searcher.createUrl(VideoObjects, this.VideoURL), true);
          xmlhttp.send();
        });
    });
  }
};
