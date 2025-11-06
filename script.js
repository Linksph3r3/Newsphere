const apiKey = "c46d03e6c94847aeb3e0c3f70f777dd4"; // your NewsAPI key
const proxy = "https://cors-anywhere.herokuapp.com/";
const url = `${proxy}https://newsapi.org/v2/top-headlines?country=us&pageSize=5&apiKey=${apiKey}`;

async function loadNews() {
  const container = document.getElementById("newsContainer");
  try {
    const res = await fetch(url);
    if (!res.ok) throw new Error("Network error");
    const data = await res.json();

    if (data.status !== "ok") throw new Error(data.message);

    container.innerHTML = "";
    data.articles.forEach(article => {
      const item = document.createElement("div");
      item.className = "news-item";
      item.innerHTML = `
        <h3>${article.title}</h3>
        ${article.urlToImage ? `<img src="${article.urlToImage}" alt="" style="width:100%; border-radius:8px; margin:0.5rem 0;">` : ""}
        <p>${article.description || ""}</p>
        <a href="${article.url}" target="_blank">Read full article →</a>
      `;
      container.appendChild(item);
    });
  } catch (err) {
    container.innerHTML = `<p style="color:red;">Unable to load news at the moment.<br>${err.message}</p>`;
  }
}

loadNews();
