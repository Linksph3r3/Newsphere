const apiKey = "1d92a3b191291724c295c9c5ea3f68a4";

const endpoints = {
  global: `https://gnews.io/api/v4/top-headlines?lang=en&max=3&token=${apiKey}`,
  entertainment: `https://gnews.io/api/v4/top-headlines?lang=en&topic=entertainment&max=3&token=${apiKey}`,
  sports: `https://gnews.io/api/v4/top-headlines?lang=en&topic=sports&max=3&token=${apiKey}`,
};

async function loadCategoryNews(containerId, url) {
  const container = document.getElementById(containerId);
  try {
    container.innerHTML = "<p>Loading...</p>";

    // ✅ Use a more reliable proxy
    const res = await fetch(`https://corsproxy.io/?${encodeURIComponent(url)}`);
    if (!res.ok) throw new Error("Network error");

    const data = await res.json();

    if (!data.articles || data.articles.length === 0)
      throw new Error("No articles available.");

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
    container.innerHTML = `<p style="color:red;">Error: ${err.message}</p>`;
  }
}

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

loadAllNews();
setInterval(loadAllNews, 3 * 60 * 60 * 1000);
