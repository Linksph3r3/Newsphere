const API_KEY = "YOUR_GNEWS_API_KEY"; 1d92a3b191291724c295c9c5ea3f68a4

async function fetchNews(topic, containerId) {
  const url = `https://gnews.io/api/v4/top-headlines?topic=${topic}&lang=en&max=6&token=${API_KEY}`;
  const container = document.getElementById(containerId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    const res = await fetch(url);

    if (!res.ok) {
      throw new Error(`Failed to load ${topic} news (${res.status})`);
    }

    const data = await res.json();
    container.innerHTML = "";

    data.articles.forEach(article => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        ${article.image ? `<img src="${article.image}" alt="">` : ""}
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read →</a>
      `;
      container.appendChild(item);
    });

  } catch (err) {
    console.error("Error:", err);
    container.innerHTML = `<p style="color:red;">Error loading ${topic} news.</p>`;
  }
}

function updateAll() {
  fetchNews("world", "globalNews");
  fetchNews("entertainment", "entertainmentNews");
  fetchNews("sports", "sportsNews");
}

updateAll();
setInterval(updateAll, 3 * 60 * 60 * 1000); // auto-refresh every 3h
