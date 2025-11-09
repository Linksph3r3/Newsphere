const API_KEY = "YOUR_GNEWS_API_KEY"; // 1d92a3b191291724c295c9c5ea3f68a4
const BASE_URL = "https://gnews.io/api/v4/top-headlines";

async function fetchNews(category, containerId) {
  try {
    const response = await fetch(
      `${BASE_URL}?category=${category}&lang=en&max=6&apikey=${API_KEY}`
    );

    if (!response.ok) throw new Error("Failed to fetch");

    const data = await response.json();
    const container = document.getElementById(containerId);
    container.innerHTML = "";

    data.articles.forEach(article => {
      const item = document.createElement("div");
      item.classList.add("news-item");
      item.innerHTML = `
        <img src="${article.image || 'https://via.placeholder.com/300x160'}" alt="">
        <h3>${article.title}</h3>
        <p>${article.description || 'No description available.'}</p>
        <a href="${article.url}" target="_blank">Read more →</a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    console.error(err);
    document.getElementById(containerId).innerHTML =
      "<p style='text-align:center; color:red;'>Failed to load news.</p>";
  }
}

function updateAll() {
  fetchNews("general", "globalNews");
  fetchNews("entertainment", "entertainmentNews");
  fetchNews("sports", "sportsNews");
  document.getElementById("lastUpdated").textContent =
    "Last updated: " + new Date().toLocaleTimeString();
}

// Initial load
updateAll();

// Auto-refresh every 10 minutes
setInterval(updateAll, 10 * 60 * 1000);
