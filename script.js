const apiKey = "YOUR_NEWSAPI_KEY"; // 🔑 Replace this with your real NewsAPI.org key
const url = `https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;

async function loadNews() {
  const container = document.getElementById("news-container");
  container.innerHTML = "<p>Fetching latest headlines...</p>";

  try {
    const res = await fetch(url);
    const data = await res.json();

    if (data.status !== "ok") {
      container.innerHTML = "<p>Unable to load news at the moment.</p>";
      return;
    }

    container.innerHTML = "";
    data.articles.forEach(article => {
      const item = document.createElement("article");
      item.className = "news-item";
      item.innerHTML = `
        <h2>${article.title || "Untitled"}</h2>
        <p>${article.description || "No description available."}</p>
        <a href="${article.url}" target="_blank" rel="noopener">Read more →</a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    container.innerHTML = "<p>Error loading news. Please refresh later.</p>";
  }
}

loadNews();
