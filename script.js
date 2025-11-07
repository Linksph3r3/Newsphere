const apiKey = "1d92a3b191291724c295c9c5ea3f68a4";
const proxy = "https://api.allorigins.win/raw?url=";
const gnewsUrl = `https://gnews.io/api/v4/top-headlines?lang=en&max=6&apikey=${apiKey}`;

async function loadNews() {
  const container = document.getElementById("newsContainer");
  const updated = document.getElementById("lastUpdated");

  try {
    container.innerHTML = "<p>Refreshing world news...</p>";

    // Encode the GNews URL through the proxy
    const res = await fetch(`${proxy}${encodeURIComponent(gnewsUrl)}`);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    if (!data.articles || data.articles.length === 0)
      throw new Error("No news available right now.");

    container.innerHTML = "";
    data.articles.forEach(article => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        <h3>${article.title}</h3>
        ${article.image ? `<img src="${article.image}" alt="News Image" style="width:100%; border-radius:8px; margin:0.5rem 0;">` : ""}
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read full article →</a>
      `;
      container.appendChild(item);
    });

    if (updated)
      updated.textContent = "Last updated: " + new Date().toLocaleString();

  } catch (err) {
    container.innerHTML = `<p style="color:red;">Unable to load global news at the moment.<br>${err.message}</p>`;
  }
}

// Run immediately + every 3 hours
loadNews();
setInterval(loadNews, 3 * 60 * 60 * 1000);
