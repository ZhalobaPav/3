const newsContainer = document.getElementById('news-list');

function fetchNews() {
    return fetch('https://newsapi.org/v2/top-headlines?sources=bbc-news&apiKey=c7e72fb31aa24f6c852b43b838349e15')
      .then(response => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then(data => data.articles)
      .catch(error => {
        console.error('Fetch error:', error);
      });
  }
  
  function displayNews(articles) {
    newsContainer.innerHTML = '';
  
    articles.forEach(article => {
      const articleElement = document.createElement('div');
      articleElement.classList.add('product', 'light-grey-background');
  
      articleElement.innerHTML = `
        <h2 class="popular__item-title">${article.title}</h2>
        <p>${article.description}</p>
        <img src="${article.urlToImage}" alt="${article.title}" class="popular__img">
        <a href="${article.url}" class="content__text" target="_blank">Read more</a>
      `;
  
      newsContainer.appendChild(articleElement);
    });
  }
  
  document.addEventListener('DOMContentLoaded', function () {
    fetchNews()
      .then(displayNews)
      .catch(error => {
        console.error('Display error:', error);
      });
  });
  