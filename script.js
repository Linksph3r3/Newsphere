const API_KEY = "1d92a3b191291724c295c9c5ea3f68a4";
const PROXY = "https://api.allorigins.win/get?url="; // bypass CORS
const topics = ["world", "sports", "entertainment"];
const refreshDelay = 3 * 60 * 60 * 1000; // 3 hours in ms

async function fetchNews(topic) {
  const url = encodeURIComponent(`https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&max=9&token=${API_KEY}`);
  try {
    const res = await fetch(`${PROXY}${url}`);
    const data = await res.json();
    const articles = JSON.parse(data.contents).articles;
    return articles;
  } catch (err) {
    console.error("Error fetching", topic, err);
    return [];
  }
}

function displayArticles(sectionId, articles) {
  const section = document.querySelector(`#${sectionId} .articles`);
  section.innerHTML = ""; // clear previous ones

  // Only show 3 articles per refresh
  const slice = articles.slice(0, 3);

  slice.forEach(a => {
    const div = document.createElement("div");
    div.className = "article";
    div.innerHTML = `
      <img src="${a.image || 'https://via.placeholder.com/120x80'}" alt="">
      <div>
        <h3><a href="${a.url}" target="_blank">${a.title}</a></h3>
        <p>${a.description || ''}</p>
      </div>`;
    section.appendChild(div);
  });
}

async function updateAll() {
  for (const topic of topics) {
    const articles = await fetchNews(topic);
    if (articles.length > 0) displayArticles(topic, articles);
  }
  console.log("News updated at", new Date().toLocaleTimeString());
}

// Initial load
updateAll();

// Refresh every 3 hours
setInterval(updateAll, refreshDelay);
