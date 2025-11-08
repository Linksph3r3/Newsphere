const apiKey = "1d92a3b191291724c295c9c5ea3f68a4";

// Define endpoints for each section
const endpoints = {
  global: `https://gnews.io/api/v4/top-headlines?lang=en&max=3&token=${apiKey}`,
  entertainment: `https://gnews.io/api/v4/top-headlines?lang=en&topic=entertainment&max=3&token=${apiKey}`,
  sports: `https://gnews.io/api/v4/top-headlines?lang=en&topic=sports&max=3&token=${apiKey}`,
};

// Load news by category using a proxy to bypass CORS
async function loadCategoryNews(containerId, url) {
  const container = document.getElementById(containerId);
  container.innerHTML = "<p>Loading...</p>";

  try {
    // Always use proxy
    const proxyUrl = "https://api.allorigins.win/get?url=" + encodeURIComponent(url);
    const res = await fetch(proxyUrl);
    if (!res.ok) throw new Error("Failed to fetch through proxy");

    const raw = await res.json();
    const data = JSON.parse(raw.contents);

    renderNews(container, data);
  } catch (err) {
    console.error("Error loading news:", err);
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

// Render the fetched news into the section
function renderNews(container, data) {
  if (!data.articles || data.articles.length === 0) {
    container.innerHTML = "<p>No articles available.</p>";
    return;
  }

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
}

// Load all 3 categories
async function loadAllNews() {
  const updateText = document.getElementById("lastUpdated");
  if (updateText) updateText.textContent = "Updating news...";

  await Promise.all([
    loadCategoryNews("globalNews", endpoints.global),
    loadCategoryNews("entertainmentNews", endpoints.entertainment),
    loadCategoryNews("sportsNews", endpoints.sports),
  ]);

  if (updateText)
    updateText.textContent = "Last updated: " + new Date().toLocaleString();
}

// Load initially and refresh every 3 hours
loadAllNews();
setInterval(loadAllNews, 3 * 60 * 60 * 1000);
