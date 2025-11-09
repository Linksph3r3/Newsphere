const PROXY = "https://api.allorigins.win/get?url=";
const API_KEY = "1d92a3b191291724c295c9c5ea3f68a4";

async function fetchNews(topic, containerId) {
  const container = document.getElementById(containerId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    const url = `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&max=6&token=${API_KEY}`;
    const res = await fetch(PROXY + encodeURIComponent(url));

    if (!res.ok) throw new Error("Failed to load " + topic);
    const raw = await res.json();
    const data = JSON.parse(raw.contents);

    if (!data.articles || !data.articles.length) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    container.innerHTML = "";
    data.articles.forEach(a => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        ${a.image ? `<img src="${a.image}" alt="">` : ""}
        <h3>${a.title}</h3>
        <p>${a.description || ""}</p>
        <a href="${a.url}" target="_blank">Read →</a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;">${err.message}</p>`;
  }
}

async function updateAll() {
  await Promise.all([
    fetchNews("world", "globalNews"),
    fetchNews("entertainment", "entertainmentNews"),
    fetchNews("sports", "sportsNews"),
  ]);
}

updateAll();
setInterval(updateAll, 3 * 60 * 60 * 1000);
