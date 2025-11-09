// ✅ Your GNews API key
const apiKey = "1d92a3b191291724c295c9c5ea3f68a4";

// ✅ GNews endpoints for 3 sections
const endpoints = {
  world: `https://gnews.io/api/v4/top-headlines?topic=world&lang=en&max=3&token=${apiKey}`,
  entertainment: `https://gnews.io/api/v4/top-headlines?topic=entertainment&lang=en&max=3&token=${apiKey}`,
  sports: `https://gnews.io/api/v4/top-headlines?topic=sports&lang=en&max=3&token=${apiKey}`,
};

// ✅ Function to fetch and render a section
async function fetchNews(sectionId, url) {
  const container = document.getElementById(sectionId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    // Use a working proxy to bypass CORS (GitHub Pages compatible)
    const proxyUrl = `https://corsproxy.io/?${encodeURIComponent(url)}`;
    const response = await fetch(proxyUrl);
    if (!response.ok) throw new Error(`Failed to fetch ${sectionId} news (${response.status})`);

    const data = await response.json();

    if (!data.articles || data.articles.length === 0) {
      container.innerHTML = "<p>No articles found.</p>";
      return;
    }

    // ✅ Render news articles
    container.innerHTML = "";
    data.articles.forEach(article => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        ${article.image ? `<img src="${article.image}" alt="News Image">` : ""}
        <h3>${article.title}</h3>
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read →</a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error(`Error fetching ${sectionId}`, err);
    container.innerHTML = `<p style="color:red;">Error loading ${sectionId} news</p>`;
  }
}

// ✅ Update all sections
async function updateAll() {
  const updateText = document.getElementById("lastUpdated");
  if (updateText) updateText.textContent = "Updating news...";

  await Promise.all([
    fetchNews("worldNews", endpoints.world),
    fetchNews("entertainmentNews", endpoints.entertainment),
    fetchNews("sportsNews", endpoints.sports),
  ]);

  if (updateText) {
    updateText.textContent = "Last updated: " + new Date().toLocaleString();
  }
}

// ✅ Initial load + auto-update every 3 hours
updateAll();
setInterval(updateAll, 3 * 60 * 60 * 1000);
