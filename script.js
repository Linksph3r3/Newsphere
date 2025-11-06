// ✅ Using your GNews API key
const apiKey = "1d92a3b191291724c295c9c5ea3f68a4";

// 🌍 Global news (no country filter)
const url = `https://gnews.io/api/v4/top-headlines?lang=en&max=6&apikey=${apiKey}`;

async function loadNews() {
  const container = document.getElementById("newsContainer");
  const updated = document.getElementById("lastUpdated");
  try {
    container.innerHTML = "<p>Refreshing world news...</p>";
    const res = await fetch(url);
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

    updated.textContent = "Last updated: " + new Date().toLocaleString();
    console.log("Global news updated:", new Date().toLocaleTimeString());
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Unable to load global news at the moment.<br>${err.message}</p>`;
  }
}

// 🔁 Load immediately, refresh every 3 hours
loadNews();
setInterval(loadNews, 3 * 60 * 60 * 1000);
